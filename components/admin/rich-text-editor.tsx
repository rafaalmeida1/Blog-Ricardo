"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, ImageIcon, Link2, Upload, Type, Minus } from "lucide-react"
import React, { useState, useRef } from "react"
import { toast } from "sonner"

interface RichTextEditorProps {
  content: any
  onChange: (content: any) => void
}

function ImageDialog({ editor }: { editor: any }) {
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addImageFromUrl = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().insertContent({
        type: 'image',
        attrs: {
          src: imageUrl.trim(),
          alt: 'Imagem',
          title: 'Imagem'
        }
      }).run()
      setImageUrl("")
      toast.success("Imagem adicionada!")
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

      editor.chain().focus().insertContent({
        type: 'image',
        attrs: {
          src: data.url,
          alt: 'Imagem',
          title: 'Imagem'
        }
      }).run()
      toast.success("Imagem enviada e adicionada!")
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
          />
          <Button type="button" onClick={addImageFromUrl} disabled={!imageUrl.trim()}>
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
            id="file-upload"
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
    </div>
  )
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-8 border-t-2 border-gray-300",
        },
      }),
    ],
    content: content || { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange(json)
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4 border rounded-md",
      },
    },
  })

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content) {
      console.log('Updating editor content:', content)
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) return null

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setIsLinkDialogOpen(false)
      toast.success("Link adicionado ao conteúdo!")
    }
  }

  return (
    <div className="border rounded-md bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        {/* Títulos */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
          size="sm"
        >
          H1
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          size="sm"
        >
          H2
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          size="sm"
        >
          H3
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          variant={editor.isActive("paragraph") ? "secondary" : "ghost"}
          size="sm"
        >
          P
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Formatação */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Listas */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="icon"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="icon"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="icon"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Linha horizontal */}
        <Button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          variant="ghost"
          size="icon"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Imagem</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <ImageDialog editor={editor} />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <Link2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL do Link</Label>
                <Input
                  id="linkUrl"
                  placeholder="https://exemplo.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
            <Button type="button" onClick={addLink}>
              Adicionar
            </Button>
          </DialogContent>
        </Dialog>

        <Button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          variant="ghost"
          size="icon"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          variant="ghost"
          size="icon"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}