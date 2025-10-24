"use client"

import { useEffect, useRef, useState } from "react"
import { ClickableImage } from "@/components/clickable-image"

interface ThesisContentProps {
  content: any
}

export function ThesisContent({ content }: ThesisContentProps) {
  const [allImages, setAllImages] = useState<string[]>([])

  useEffect(() => {
    if (!content?.content) return

    // Extract all images from content
    const images: string[] = []
    const extractImages = (node: any) => {
      if (node.type === "image" && node.attrs?.src) {
        images.push(node.attrs.src)
      }
      if (node.content) {
        node.content.forEach(extractImages)
      }
    }
    content.content.forEach(extractImages)
    setAllImages(images)
  }, [content])

  const renderContent = (node: any, index: number): React.ReactNode => {
    if (!node) return null

    switch (node.type) {
      case "paragraph":
        const text = node.content?.map((child: any, childIndex: number) => {
          if (child.type === "text") {
            let element = child.text
            if (child.marks) {
              child.marks.forEach((mark: any) => {
                switch (mark.type) {
                  case "bold":
                    element = <strong key={childIndex} className="font-semibold">{element}</strong>
                    break
                  case "italic":
                    element = <em key={childIndex} className="italic">{element}</em>
                    break
                  case "underline":
                    element = <u key={childIndex} className="underline">{element}</u>
                    break
                  case "strike":
                    element = <s key={childIndex} className="line-through">{element}</s>
                    break
                  case "code":
                    element = <code key={childIndex} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{element}</code>
                    break
                  case "highlight":
                    element = <mark key={childIndex} className="bg-yellow-200 px-1">{element}</mark>
                    break
                  case "subscript":
                    element = <sub key={childIndex} className="text-xs">{element}</sub>
                    break
                  case "superscript":
                    element = <sup key={childIndex} className="text-xs">{element}</sup>
                    break
                  case "link":
                    const href = mark.attrs?.href || "#"
                    element = (
                      <a 
                        key={childIndex}
                        href={href} 
                        className="text-primary underline hover:text-primary/80 transition-colors" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {element}
                      </a>
                    )
                    break
                }
              })
            }
            return element
          }
          return null
        }).filter(Boolean) || []
        
        // Get text alignment from node attributes
        const paragraphAlign = node.attrs?.textAlign || 'left'
        const paragraphAlignmentClass = paragraphAlign === 'center' ? 'text-center' : 
                                      paragraphAlign === 'right' ? 'text-right' : 
                                      paragraphAlign === 'justify' ? 'text-justify' : 'text-left'
        
        return <p key={index} className={`mb-4 leading-relaxed text-gray-800 ${paragraphAlignmentClass}`}>{text}</p>

      case "heading":
        const level = node.attrs?.level || 1
        const headingText = node.content?.map((child: any, childIndex: number) => {
          if (child.type === "text") {
            let element = child.text
            if (child.marks) {
              child.marks.forEach((mark: any) => {
                switch (mark.type) {
                  case "bold":
                    element = <strong key={childIndex} className="font-semibold">{element}</strong>
                    break
                  case "italic":
                    element = <em key={childIndex} className="italic">{element}</em>
                    break
                  case "link":
                    const href = mark.attrs?.href || "#"
                    element = (
                      <a 
                        key={childIndex}
                        href={href} 
                        className="text-primary underline hover:text-primary/80 transition-colors" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {element}
                      </a>
                    )
                    break
                }
              })
            }
            return element
          }
          return null
        }).filter(Boolean) || []
        
        // Get text alignment from node attributes
        const headingAlign = node.attrs?.textAlign || 'left'
        const headingAlignmentClass = headingAlign === 'center' ? 'text-center' : 
                                     headingAlign === 'right' ? 'text-right' : 
                                     headingAlign === 'justify' ? 'text-justify' : 'text-left'
        
        const headingClass = level === 1 ? "text-4xl font-bold mb-6 mt-8 text-gray-900" : 
                           level === 2 ? "text-3xl font-bold mb-4 mt-6 text-gray-900" : 
                           level === 3 ? "text-2xl font-bold mb-3 mt-4 text-gray-900" :
                           level === 4 ? "text-xl font-bold mb-3 mt-4 text-gray-900" :
                           level === 5 ? "text-lg font-bold mb-2 mt-3 text-gray-900" :
                           "text-base font-bold mb-2 mt-3 text-gray-900"
        
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
        return <HeadingTag key={index} className={`${headingClass} ${headingAlignmentClass}`}>{headingText}</HeadingTag>

      case "bulletList":
        const bulletItems = node.content?.map((item: any, itemIndex: number) => {
          const itemText = item.content?.[0]?.content?.map((child: any, childIndex: number) => {
            if (child.type === "text") {
              let element = child.text
              if (child.marks) {
                child.marks.forEach((mark: any) => {
                  switch (mark.type) {
                    case "bold":
                      element = <strong key={childIndex} className="font-semibold">{element}</strong>
                      break
                    case "italic":
                      element = <em key={childIndex} className="italic">{element}</em>
                      break
                    case "link":
                      const href = mark.attrs?.href || "#"
                      element = (
                        <a 
                          key={childIndex}
                          href={href} 
                          className="text-primary underline hover:text-primary/80 transition-colors" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {element}
                        </a>
                      )
                      break
                  }
                })
              }
              return element
            }
            return null
          }).filter(Boolean) || []
          return <li key={itemIndex} className="leading-relaxed">{itemText}</li>
        }) || []
        
        // Get text alignment from node attributes
        const bulletAlign = node.attrs?.textAlign || 'left'
        const bulletAlignmentClass = bulletAlign === 'center' ? 'text-center' : 
                                    bulletAlign === 'right' ? 'text-right' : 
                                    bulletAlign === 'justify' ? 'text-justify' : 'text-left'
        
        return <ul key={index} className={`list-disc list-inside mb-4 space-y-2 text-gray-800 ${bulletAlignmentClass}`}>{bulletItems}</ul>

      case "orderedList":
        const orderedItems = node.content?.map((item: any, itemIndex: number) => {
          const itemText = item.content?.[0]?.content?.map((child: any, childIndex: number) => {
            if (child.type === "text") {
              let element = child.text
              if (child.marks) {
                child.marks.forEach((mark: any) => {
                  switch (mark.type) {
                    case "bold":
                      element = <strong key={childIndex} className="font-semibold">{element}</strong>
                      break
                    case "italic":
                      element = <em key={childIndex} className="italic">{element}</em>
                      break
                    case "link":
                      const href = mark.attrs?.href || "#"
                      element = (
                        <a 
                          key={childIndex}
                          href={href} 
                          className="text-primary underline hover:text-primary/80 transition-colors" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {element}
                        </a>
                      )
                      break
                  }
                })
              }
              return element
            }
            return null
          }).filter(Boolean) || []
          return <li key={itemIndex} className="leading-relaxed">{itemText}</li>
        }) || []
        
        // Get text alignment from node attributes
        const orderedAlign = node.attrs?.textAlign || 'left'
        const orderedAlignmentClass = orderedAlign === 'center' ? 'text-center' : 
                                     orderedAlign === 'right' ? 'text-right' : 
                                     orderedAlign === 'justify' ? 'text-justify' : 'text-left'
        
        return <ol key={index} className={`list-decimal list-inside mb-4 space-y-2 text-gray-800 ${orderedAlignmentClass}`}>{orderedItems}</ol>

      case "blockquote":
        const blockquoteText = node.content?.map((child: any, childIndex: number) => {
          if (child.type === "text") {
            let element = child.text
            if (child.marks) {
              child.marks.forEach((mark: any) => {
                switch (mark.type) {
                  case "bold":
                    element = <strong key={childIndex} className="font-semibold">{element}</strong>
                    break
                  case "italic":
                    element = <em key={childIndex} className="italic">{element}</em>
                    break
                  case "link":
                    const href = mark.attrs?.href || "#"
                    element = (
                      <a 
                        key={childIndex}
                        href={href} 
                        className="text-primary underline hover:text-primary/80 transition-colors" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {element}
                      </a>
                    )
                    break
                }
              })
            }
            return element
          }
          return null
        }).filter(Boolean) || []
        
        // Get text alignment from node attributes
        const blockquoteAlign = node.attrs?.textAlign || 'left'
        const blockquoteAlignmentClass = blockquoteAlign === 'center' ? 'text-center' : 
                                        blockquoteAlign === 'right' ? 'text-right' : 
                                        blockquoteAlign === 'justify' ? 'text-justify' : 'text-left'
        
        return <blockquote key={index} className={`border-l-4 border-primary pl-4 italic my-4 text-gray-700 bg-gray-50 py-2 rounded-r ${blockquoteAlignmentClass}`}>{blockquoteText}</blockquote>

      case "codeBlock":
        const codeText = node.content?.[0]?.text || ""
        const language = node.attrs?.language || ""
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
            <code className={`language-${language}`}>{codeText}</code>
          </pre>
        )

      case "horizontalRule":
        return <hr key={index} className="my-8 border-t-2 border-gray-300" />

      case "image":
        const src = node.attrs?.src || ""
        const alt = node.attrs?.alt || ""
        if (!src) return null
        
        const imageIndex = allImages.findIndex(img => img === src)
        return (
          <div key={index} className="my-8 text-center">
            <ClickableImage
              src={src}
              alt={alt}
              className="rounded-lg max-w-full h-auto mx-auto shadow-lg"
              allImages={allImages}
              imageIndex={imageIndex}
            />
          </div>
        )

      case "video":
        const videoSrc = node.attrs?.src || ""
        if (!videoSrc) return null
        return (
          <div key={index} className="my-8 text-center">
            <video 
              src={videoSrc} 
              controls 
              className="rounded-lg max-w-full h-auto mx-auto shadow-lg" 
              style={{ width: node.attrs?.width || '100%' }}
            />
          </div>
        )

      case "audio":
        const audioSrc = node.attrs?.src || ""
        if (!audioSrc) return null
        return (
          <div key={index} className="my-8">
            <audio src={audioSrc} controls className="w-full" />
          </div>
        )

      default:
        return null
    }
  }

  if (!content?.content) return null

  return (
    <div className="prose prose-lg max-w-none">
      {content.content.map((node: any, index: number) => renderContent(node, index))}
    </div>
  )
}