"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Highlight from "@tiptap/extension-highlight"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
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
  Music,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline as UnderlineIcon,
  Highlighter,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Link as LinkIcon,
  Unlink,
  Save,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  FileText,
  Palette
} from "lucide-react"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"

interface SimpleEditorProps {
  content: any
  onChange: (content: any) => void
  placeholder?: string
  minHeight?: string
  showToolbar?: boolean
  showWordCount?: boolean
  autoSave?: boolean
  onSave?: (content: any) => void
  className?: string
}

interface MediaDialogProps {
  editor: any
  mediaType: 'image' | 'video' | 'audio'
  isOpen: boolean
  onClose: () => void
}

function MediaDialog({ editor, mediaType, isOpen, onClose }: MediaDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [mediaUrlInput, setMediaUrlInput] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

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
      setUploadProgress(0)
    }
  }, [editor, mediaType, onClose])

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
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                    style={{ transform: `rotate(${uploadProgress * 3.6}deg)` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {uploadProgress}%
                  </div>
                </div>
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

export function SimpleEditor({ 
  content, 
  onChange, 
  placeholder = "Comece a escrever...",
  minHeight = "400px",
  showToolbar = true,
  showWordCount = true,
  autoSave = false,
  onSave,
  className = ""
}: SimpleEditorProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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
          class: "rounded-lg max-w-full h-auto my-4 shadow-sm",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80 transition-colors",
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-8 border-t-2 border-gray-300",
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content: content || { type: 'doc', content: [] },
    editable: !isPreviewMode,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange(json)
      setHasUnsavedChanges(true)
      
      // Contar palavras e caracteres
      const text = editor.getText()
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
      setCharCount(text.length)
      
      // Auto-save se habilitado
      if (autoSave && onSave) {
        onSave(json)
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none p-4 ${isPreviewMode ? 'bg-gray-50' : ''}`,
        style: `min-height: ${minHeight}`,
      },
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content) {
      try {
        editor.commands.setContent(content)
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Error setting editor content:', error)
        editor.commands.setContent({ type: 'doc', content: [] })
      }
    }
  }, [editor, content])

  // Auto-save timer
  useEffect(() => {
    if (autoSave && onSave && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        onSave(content)
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [content, autoSave, onSave, hasUnsavedChanges])

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault()
            if (onSave) {
              onSave(content)
              setLastSaved(new Date())
              setHasUnsavedChanges(false)
              toast.success('Conteúdo salvo!')
            }
            break
          case 'f':
            event.preventDefault()
            setIsFullscreen(!isFullscreen)
            break
          case 'p':
            event.preventDefault()
            setIsPreviewMode(!isPreviewMode)
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, content, onSave, isFullscreen, isPreviewMode])

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setIsLinkDialogOpen(false)
      toast.success("Link adicionado!")
    }
  }, [linkUrl, editor])

  const removeLink = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetLink().run()
      toast.success("Link removido!")
    }
  }, [editor])

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(content)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      toast.success('Conteúdo salvo!')
    }
  }, [onSave, content])

  if (!editor) {
    return (
      <div className="border rounded-lg bg-white shadow-sm p-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg bg-white shadow-sm ${isFullscreen ? 'fixed inset-4 z-50 bg-white' : ''} ${className}`}>
      {/* Status Bar */}
      {(showWordCount || lastSaved || hasUnsavedChanges) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
          <div className="flex items-center gap-4">
            {showWordCount && (
              <span>{wordCount} palavras • {charCount} caracteres</span>
            )}
            {hasUnsavedChanges && (
              <span className="text-orange-600 font-medium">• Não salvo</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-gray-500">Salvo às {lastSaved.toLocaleTimeString()}</span>
            )}
            {onSave && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-6 px-2 text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Salvar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-gray-50">
          {/* Headings */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              title="Título 1 (Ctrl+Alt+1)"
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
              title="Título 2 (Ctrl+Alt+2)"
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
              title="Título 3 (Ctrl+Alt+3)"
            >
              <Heading3 className="h-4 w-4 mr-1" />
              H3
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              variant={editor.isActive("bold") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Negrito (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              variant={editor.isActive("italic") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Itálico (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              variant={editor.isActive("underline") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Sublinhado (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              variant={editor.isActive("strike") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Riscado"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              variant={editor.isActive("code") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Código (Ctrl+E)"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              variant={editor.isActive("highlight") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Destacar"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists and Structure */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Lista com marcadores"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Lista numerada"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Citação"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Linha horizontal"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              variant={editor.isActive({ textAlign: 'left' }) ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Alinhar à esquerda"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              variant={editor.isActive({ textAlign: 'center' }) ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Centralizar"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              variant={editor.isActive({ textAlign: 'right' }) ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Alinhar à direita"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              variant={editor.isActive({ textAlign: 'justify' }) ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Justificar"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Media */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => setIsImageDialogOpen(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Inserir imagem"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => setIsVideoDialogOpen(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Inserir vídeo"
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => setIsAudioDialogOpen(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Inserir áudio"
            >
              <Music className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Links */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => setIsLinkDialogOpen(true)}
              variant={editor.isActive('link') ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Inserir link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={removeLink}
              disabled={!editor.isActive('link')}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Remover link"
            >
              <Unlink className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* History */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Desfazer (Ctrl+Z)"
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
              title="Refazer (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Controls */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              variant={isPreviewMode ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Modo visualização (Ctrl+P)"
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant={isFullscreen ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Tela cheia (Ctrl+F)"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        {isPreviewMode && (
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg border">
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="h-4 w-4" />
                <span>Modo visualização ativo</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Dialogs */}
      <MediaDialog
        editor={editor}
        mediaType="image"
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
      />
      <MediaDialog
        editor={editor}
        mediaType="video"
        isOpen={isVideoDialogOpen}
        onClose={() => setIsVideoDialogOpen(false)}
      />
      <MediaDialog
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
                onKeyPress={(e) => e.key === 'Enter' && addLink()}
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