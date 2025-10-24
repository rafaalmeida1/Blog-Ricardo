"use client"

import Image from "next/image"
import { useState } from "react"
import { useImageViewer } from "@/hooks/use-image-viewer"
import { ImageViewer } from "@/components/image-viewer"
import { ZoomIn } from "lucide-react"

interface ClickableImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  fill?: boolean
  onClick?: () => void
  allImages?: string[] // Para navegação entre múltiplas imagens
  imageIndex?: number // Índice da imagem atual
}

export function ClickableImage({
  src,
  alt,
  width,
  height,
  className = "",
  style,
  priority = false,
  fill = false,
  onClick,
  allImages,
  imageIndex = 0
}: ClickableImageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { isOpen, images, currentIndex, openViewer, closeViewer, goToImage } = useImageViewer()

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }

    // Se temos múltiplas imagens, usar todas; senão, usar apenas a atual
    const imagesToShow = allImages && allImages.length > 0 ? allImages : [src]
    const startIndex = allImages ? imageIndex : 0
    
    openViewer(imagesToShow, startIndex)
  }

  return (
    <>
      <div
        className={`relative cursor-pointer group ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            priority={priority}
            style={style}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="transition-transform duration-200 group-hover:scale-105"
            priority={priority}
            style={style}
          />
        )}
        
        {/* Overlay com ícone de zoom */}
        <div
          className={`absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-white/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-200">
            <ZoomIn className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        isOpen={isOpen}
        onClose={closeViewer}
        images={images}
        currentIndex={currentIndex}
        onIndexChange={goToImage}
      />
    </>
  )
}
