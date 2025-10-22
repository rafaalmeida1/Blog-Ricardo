"use client"

import { useEffect, useRef } from "react"

interface ThesisContentProps {
  content: any
}

export function ThesisContent({ content }: ThesisContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current || !content) return

    const renderContent = (node: any): string => {
      if (!node) return ""

      switch (node.type) {
        case "paragraph":
          const text = node.content?.map((child: any) => {
            if (child.type === "text") {
              let html = child.text
              if (child.marks) {
                child.marks.forEach((mark: any) => {
                  switch (mark.type) {
                    case "bold":
                      html = `<strong class="font-semibold">${html}</strong>`
                      break
                    case "italic":
                      html = `<em class="italic">${html}</em>`
                      break
                    case "link":
                      const href = mark.attrs?.href || "#"
                      html = `<a href="${href}" class="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">${html}</a>`
                      break
                  }
                })
              }
              return html
            }
            return ""
          }).join("") || ""
          return `<p class="mb-4 leading-relaxed text-gray-800">${text}</p>`

        case "heading":
          const level = node.attrs?.level || 1
          const headingText = node.content?.map((child: any) => {
            if (child.type === "text") {
              let html = child.text
              if (child.marks) {
                child.marks.forEach((mark: any) => {
                  switch (mark.type) {
                    case "bold":
                      html = `<strong class="font-semibold">${html}</strong>`
                      break
                    case "italic":
                      html = `<em class="italic">${html}</em>`
                      break
                    case "link":
                      const href = mark.attrs?.href || "#"
                      html = `<a href="${href}" class="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">${html}</a>`
                      break
                  }
                })
              }
              return html
            }
            return ""
          }).join("") || ""
          
          const headingClass = level === 1 ? "text-4xl font-bold mb-6 mt-8 text-gray-900" : 
                             level === 2 ? "text-3xl font-bold mb-4 mt-6 text-gray-900" : 
                             level === 3 ? "text-2xl font-bold mb-3 mt-4 text-gray-900" :
                             level === 4 ? "text-xl font-bold mb-3 mt-4 text-gray-900" :
                             level === 5 ? "text-lg font-bold mb-2 mt-3 text-gray-900" :
                             "text-base font-bold mb-2 mt-3 text-gray-900"
          return `<h${level} class="${headingClass}">${headingText}</h${level}>`

        case "bulletList":
          const bulletItems = node.content?.map((item: any) => {
            const itemText = item.content?.[0]?.content?.map((child: any) => {
              if (child.type === "text") {
                let html = child.text
                if (child.marks) {
                  child.marks.forEach((mark: any) => {
                    switch (mark.type) {
                      case "bold":
                        html = `<strong class="font-semibold">${html}</strong>`
                        break
                      case "italic":
                        html = `<em class="italic">${html}</em>`
                        break
                      case "link":
                        const href = mark.attrs?.href || "#"
                        html = `<a href="${href}" class="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">${html}</a>`
                        break
                    }
                  })
                }
                return html
              }
              return ""
            }).join("") || ""
            return `<li class="leading-relaxed">${itemText}</li>`
          }).join("") || ""
          return `<ul class="list-disc list-inside mb-4 space-y-2 text-gray-800">${bulletItems}</ul>`

        case "orderedList":
          const orderedItems = node.content?.map((item: any) => {
            const itemText = item.content?.[0]?.content?.map((child: any) => {
              if (child.type === "text") {
                let html = child.text
                if (child.marks) {
                  child.marks.forEach((mark: any) => {
                    switch (mark.type) {
                      case "bold":
                        html = `<strong class="font-semibold">${html}</strong>`
                        break
                      case "italic":
                        html = `<em class="italic">${html}</em>`
                        break
                      case "link":
                        const href = mark.attrs?.href || "#"
                        html = `<a href="${href}" class="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">${html}</a>`
                        break
                    }
                  })
                }
                return html
              }
              return ""
            }).join("") || ""
            return `<li class="leading-relaxed">${itemText}</li>`
          }).join("") || ""
          return `<ol class="list-decimal list-inside mb-4 space-y-2 text-gray-800">${orderedItems}</ol>`

        case "blockquote":
          const blockquoteText = node.content?.map((child: any) => {
            if (child.type === "text") {
              let html = child.text
              if (child.marks) {
                child.marks.forEach((mark: any) => {
                  switch (mark.type) {
                    case "bold":
                      html = `<strong class="font-semibold">${html}</strong>`
                      break
                    case "italic":
                      html = `<em class="italic">${html}</em>`
                      break
                    case "link":
                      const href = mark.attrs?.href || "#"
                      html = `<a href="${href}" class="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">${html}</a>`
                      break
                  }
                })
              }
              return html
            }
            return ""
          }).join("") || ""
          return `<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-gray-700 bg-gray-50 py-2 rounded-r">${blockquoteText}</blockquote>`

        case "horizontalRule":
          return `<hr class="my-8 border-t-2 border-gray-300" />`

        case "image":
          const src = node.attrs?.src || ""
          const alt = node.attrs?.alt || ""
          if (!src) return ""
          return `<div class="my-8 text-center"><img src="${src}" alt="${alt}" class="rounded-lg max-w-full h-auto mx-auto shadow-lg" /></div>`

        case "video":
          const videoSrc = node.attrs?.src || ""
          if (!videoSrc) return ""
          return `<div class="my-8 text-center"><video src="${videoSrc}" controls class="rounded-lg max-w-full h-auto mx-auto shadow-lg" style="width: ${node.attrs?.width || '100%'}"></video></div>`

        case "audio":
          const audioSrc = node.attrs?.src || ""
          if (!audioSrc) return ""
          return `<div class="my-8"><audio src="${audioSrc}" controls class="w-full"></audio></div>`

        default:
          return ""
      }
    }

    const html = content?.content ? content.content.map(renderContent).join("") : ""
    if (contentRef.current) {
      contentRef.current.innerHTML = html
    }
  }, [content])

  return <div ref={contentRef} className="prose prose-lg max-w-none" />
}