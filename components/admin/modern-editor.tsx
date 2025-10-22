"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Placeholder from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import Typography from "@tiptap/extension-typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  ImageIcon, 
  Link2, 
  Upload, 
  Type, 
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Strikethrough,
  Video,
  Music
} from "lucide-react"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"

interface ModernEditorProps {
  content: any
  onChange: (content: any) => void
}

interface MediaUploadDialogProps {
  editor: any
  mediaType: 'image' | 'video' | 'audio'
  isOpen: boolean
  onClose: () => void
}

function MediaUploadDialog({ editor, mediaType, isOpen, onClose }: MediaUploadDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [mediaUrlInput, setMediaUrlInput] = useState("")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
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

        if (editor) {
          if (mediaType === 'image') {
            editor.chain().focus().setImage({ src: data.url }).run()
          } else if (mediaType === 'video') {
            editor.chain().focus().insertContent({
              type: 'video',
              attrs: {
                src: data.url,
                controls: true,
                width: '100%'
              }
            }).run()
          } else if (mediaType === 'audio') {
            editor.chain().focus().insertContent({
              type: 'audio',
              attrs: {
                src: data.url,
                controls: true,
                width: '100%'
              }
            }).run()
          }
          toast.success(`${mediaType === 'image' ? 'Imagem' : mediaType === 'video' ? 'Vídeo' : 'Áudio'} adicionado!`)
          onClose()
        }
      } catch (error: any) {
        console.error(`Error uploading ${mediaType}:`, error)
        toast.error(`Erro ao enviar ${mediaType}: ${error.message}`)
      } finally {
        setIsUploading(false)
      }
    },
    [editor, mediaType, onClose],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mediaType === 'image' ? {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    } : mediaType === 'video' ? {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogg"],
      "video/quicktime": [".mov"],
      "video/x-msvideo": [".avi"],
      "video/x-ms-wmv": [".wmv"],
      "video/x-flv": [".flv"],
      "video/3gpp": [".3gp"],
      "video/x-matroska": [".mkv"],
    } : {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/ogg": [".ogg"],
      "audio/mp4": [".m4a"],
      "audio/x-ms-wma": [".wma"],
      "audio/aac": [".aac"],
      "audio/flac": [".flac"],
    },
    maxFiles: 1,
  })

  const handleAddMediaUrl = () => {
    if (mediaUrlInput && editor) {
      if (mediaType === 'image') {
        editor.chain().focus().setImage({ src: mediaUrlInput }).run()
      } else if (mediaType === 'video') {
        editor.chain().focus().insertContent({
          type: 'video',
          attrs: {
            src: mediaUrlInput,
            controls: true,
            width: '100%'
          }
        }).run()
      } else if (mediaType === 'audio') {
        editor.chain().focus().insertContent({
          type: 'audio',
          attrs: {
            src: mediaUrlInput,
            controls: true,
            width: '100%'
          }
        }).run()
      }
      toast.success(`${mediaType === 'image' ? 'Imagem' : mediaType === 'video' ? 'Vídeo' : 'Áudio'} adicionado!`)
      setMediaUrlInput("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Adicionar {mediaType === 'image' ? 'Imagem' : mediaType === 'video' ? 'Vídeo' : 'Áudio'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={`${mediaType}Url`}>
              URL d{mediaType === 'image' ? 'a Imagem' : mediaType === 'video' ? 'o Vídeo' : 'o Áudio'}
            </Label>
            <Input
              id={`${mediaType}Url`}
              placeholder={`https://exemplo.com/${mediaType}.${mediaType === 'image' ? 'jpg' : mediaType === 'video' ? 'mp4' : 'mp3'}`}
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
            />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Enviando {mediaType}...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {isDragActive ? `Solte o ${mediaType} aqui` : `Arraste um ${mediaType} ou clique para selecionar`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mediaType === 'image' ? 'PNG, JPG, JPEG, WEBP ou GIF (Max 50MB)' :
                   mediaType === 'video' ? 'MP4, WebM, OGG, MOV, AVI, WMV, FLV, 3GP ou MKV (Max 50MB)' :
                   'MP3, WAV, OGG, M4A, WMA, AAC ou FLAC (Max 50MB)'}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleAddMediaUrl} disabled={!mediaUrlInput}>
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ModernEditor({ content, onChange }: ModernEditorProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80",
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-8 border-t-2 border-gray-300",
        },
      }),
      Placeholder.configure({
        placeholder: "Digite '/' para ver comandos ou comece a escrever...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      TextStyle,
      Typography,
    ],
    content: content || { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange(json)
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6",
      },
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setIsLinkDialogOpen(false)
      toast.success("Link adicionado!")
    }
  }

  if (!editor) return null

  return (
    <div className="border rounded-lg bg-white shadow-sm">

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-gray-50">
        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
          >
            <Heading1 className="h-4 w-4 mr-1" />
            H1
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
          >
            <Heading2 className="h-4 w-4 mr-1" />
            H2
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
          >
            <Heading3 className="h-4 w-4 mr-1" />
            H3
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            variant={editor.isActive("strike") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            variant={editor.isActive("code") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists and Structure */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Media */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            onClick={() => setIsImageDialogOpen(true)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => setIsVideoDialogOpen(true)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => setIsAudioDialogOpen(true)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Music className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Media Upload Dialogs */}
      <MediaUploadDialog
        editor={editor}
        mediaType="image"
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
      />
      <MediaUploadDialog
        editor={editor}
        mediaType="video"
        isOpen={isVideoDialogOpen}
        onClose={() => setIsVideoDialogOpen(false)}
      />
      <MediaUploadDialog
        editor={editor}
        mediaType="audio"
        isOpen={isAudioDialogOpen}
        onClose={() => setIsAudioDialogOpen(false)}
      />

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="max-w-md">
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={addLink} disabled={!linkUrl}>
              Adicionar Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
