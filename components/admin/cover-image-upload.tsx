"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Image as ImageIcon, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface CoverImageUploadProps {
  coverImage: string
  coverImagePosition: string
  onCoverImageChange: (url: string) => void
  onPositionChange: (position: string) => void
}

export function CoverImageUpload({
  coverImage,
  coverImagePosition,
  onCoverImageChange,
  onPositionChange,
}: CoverImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddImageFromUrl = () => {
    if (imageUrl.trim()) {
      onCoverImageChange(imageUrl.trim())
      setImageUrl("")
      toast.success("Imagem de capa adicionada!")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      onCoverImageChange(data.url)
      toast.success("Imagem de capa enviada!")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(`Erro ao enviar imagem: ${error.message}`)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = () => {
    onCoverImageChange("")
    toast.success("Imagem de capa removida!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Imagem de Capa
        </CardTitle>
        <CardDescription>
          Adicione uma imagem de capa para sua tese usando URL ou upload
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coverImageUrl">URL da Imagem</Label>
          <div className="flex gap-2">
            <Input
              id="coverImageUrl"
              placeholder="https://exemplo.com/imagem.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddImageFromUrl()}
            />
            <Button type="button" onClick={handleAddImageFromUrl} disabled={!imageUrl.trim()}>
              Adicionar
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou</span>
        </div>

        <div className="space-y-2">
          <Label>Upload de Arquivo</Label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="cover-file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Arquivo
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, JPEG, WEBP ou GIF (máx. 50MB)
          </p>
        </div>

        {coverImage && (
          <div className="space-y-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={coverImage}
                alt="Imagem de capa"
                fill
                className="object-cover"
                style={{ objectPosition: coverImagePosition }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Label htmlFor="position">Posição da Imagem</Label>
                <Select value={coverImagePosition} onValueChange={onPositionChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="top">Topo</SelectItem>
                    <SelectItem value="bottom">Base</SelectItem>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}