"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { createThesis, updateThesis } from "@/app/actions/thesis"
import { CoverImageUpload } from "./cover-image-upload"
import { SimpleEditor } from "./simple-editor"
import Link from "next/link"

const thesisSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres"),
  description: z.string().min(20, "Descrição deve ter no mínimo 20 caracteres"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  published: z.boolean(),
})

type ThesisFormData = z.infer<typeof thesisSchema>

interface ThesisFormProps {
  categories: Array<{ id: string; name: string }>
  authorId: string
  thesis?: {
    id: string
    title: string
    description: string
    categoryId: string
    published: boolean
    coverImage?: string
    coverImagePosition?: string
    content?: any
  } | null
}

export function ThesisForm({ categories, authorId, thesis }: ThesisFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState("")
  const [coverImagePosition, setCoverImagePosition] = useState("center")
  const [content, setContent] = useState(() => {
    if (thesis?.content) {
      try {
        if (typeof thesis.content === 'string') {
          return JSON.parse(thesis.content)
        }
        if (typeof thesis.content === 'object' && thesis.content !== null) {
          return thesis.content
        }
      } catch (error) {
        console.error('Error parsing thesis content:', error)
      }
    }
    return { type: 'doc', content: [] }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ThesisFormData>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      published: false,
    },
  })

  const published = watch("published")

  // Initialize form with thesis data if editing
  useEffect(() => {
    if (thesis) {
      setValue("title", thesis.title)
      setValue("description", thesis.description)
      setValue("categoryId", thesis.categoryId)
      setValue("published", thesis.published)
      setCoverImage(thesis.coverImage || "")
      setCoverImagePosition(thesis.coverImagePosition || "center")
      
      console.log('Loading thesis content:', thesis.content)
      if (thesis.content) {
        if (typeof thesis.content === 'string') {
          try {
            const parsed = JSON.parse(thesis.content)
            console.log('Parsed content:', parsed)
            setContent(parsed)
          } catch (error) {
            console.error('Error parsing content:', error)
            setContent({ type: 'doc', content: [] })
          }
        } else if (typeof thesis.content === 'object' && thesis.content !== null) {
          console.log('Object content:', thesis.content)
          setContent(thesis.content)
        } else {
          console.log('Invalid content type, setting default')
          setContent({ type: 'doc', content: [] })
        }
      } else {
        console.log('No content, setting default')
        setContent({ type: 'doc', content: [] })
      }
    }
  }, [thesis, setValue])

  const onSubmit = async (data: ThesisFormData) => {
    setIsSubmitting(true)
    try {
      const thesisData = {
        ...data,
        content: JSON.stringify(content),
        coverImage,
        coverImagePosition,
        authorId,
      }

      if (thesis) {
        const result = await updateThesis(thesis.id, thesisData)
        if (result?.success) {
          toast.success("Tese atualizada com sucesso!")
          router.push("/admin")
          router.refresh()
        } else {
          toast.error(`Erro: ${result?.error || 'Erro desconhecido'}`)
        }
      } else {
        const result = await createThesis(thesisData)
        if (result?.success) {
          toast.success("Tese criada com sucesso!")
          router.push("/admin")
          router.refresh()
        } else {
          toast.error(`Erro: ${result?.error || 'Erro desconhecido'}`)
        }
      }
    } catch (error: any) {
      console.error("Error submitting thesis:", error)
      toast.error(`Erro ao salvar tese: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Tese</CardTitle>
          <CardDescription>Preencha os detalhes da sua tese ou artigo jurídico.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: Análise sobre Habeas Corpus..."
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Breve resumo da tese..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria *</Label>
            <Select 
              value={watch("categoryId")} 
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={(checked) => setValue("published", checked)}
            />
            <Label htmlFor="published">Publicar tese imediatamente</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagem de Capa</CardTitle>
          <CardDescription>Adicione uma imagem de destaque para a tese</CardDescription>
        </CardHeader>
        <CardContent>
          <CoverImageUpload
            coverImage={coverImage}
            onCoverImageChange={setCoverImage}
            coverImagePosition={coverImagePosition}
            onPositionChange={setCoverImagePosition}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo</CardTitle>
          <CardDescription>Escreva o conteúdo completo da tese</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleEditor content={content} onChange={setContent} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {thesis ? "Atualizar Tese" : "Criar Tese"}
        </Button>
      </div>
    </form>
  )
}