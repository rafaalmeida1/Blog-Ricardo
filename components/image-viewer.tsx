"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface ImageViewerProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function ImageViewer({ isOpen, onClose, images, currentIndex, onIndexChange }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const currentImage = images[currentIndex]

  // Reset zoom and rotation when image changes
  useEffect(() => {
    setZoom(1)
    setRotation(0)
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1)
          }
          break
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            onIndexChange(currentIndex + 1)
          }
          break
        case '+':
        case '=':
          setZoom(prev => Math.min(prev * 1.2, 5))
          break
        case '-':
          setZoom(prev => Math.max(prev / 1.2, 0.1))
          break
        case 'r':
        case 'R':
          setRotation(prev => (prev + 90) % 360)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length, onIndexChange, onClose])

  const handleDownload = () => {
    if (!currentImage) return
    
    const link = document.createElement('a')
    link.href = currentImage
    link.download = `image-${currentIndex + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5))
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1)
    }
  }

  if (!isOpen || !currentImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
        <div className="relative w-full h-[95vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/50 text-white">
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {currentIndex + 1} de {images.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.1}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 5}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="text-white hover:bg-white/20"
                title="Rotacionar (R)"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 relative overflow-hidden bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <Image
                  src={currentImage}
                  alt={`Imagem ${currentIndex + 1}`}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain"
                  onLoad={() => setIsLoading(false)}
                  onLoadStart={() => setIsLoading(true)}
                  priority
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                {currentIndex < images.length - 1 && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/50 text-white">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-white hover:bg-white/20"
              >
                Resetar
              </Button>
              <div className="text-xs text-gray-300">
                Use as setas para navegar • + - para zoom • R para rotacionar • ESC para fechar
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
