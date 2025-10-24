"use client"

import { useState } from "react"

export function useImageViewer() {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const openViewer = (imageUrls: string[], startIndex: number = 0) => {
    setImages(imageUrls)
    setCurrentIndex(startIndex)
    setIsOpen(true)
  }

  const closeViewer = () => {
    setIsOpen(false)
    setImages([])
    setCurrentIndex(0)
  }

  const goToImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return {
    isOpen,
    images,
    currentIndex,
    openViewer,
    closeViewer,
    goToImage,
    goToPrevious,
    goToNext
  }
}
