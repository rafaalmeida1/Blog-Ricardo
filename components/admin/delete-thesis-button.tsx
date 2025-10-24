"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { deleteThesis } from "@/app/actions/thesis"

interface DeleteThesisButtonProps {
  thesisId: string
  thesisTitle: string
}

export function DeleteThesisButton({ thesisId, thesisTitle }: DeleteThesisButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteThesis(thesisId)
      if (result?.success) {
        toast.success("Tese excluída com sucesso!")
        
        // Se estiver na página de edição, redireciona para o dashboard do admin
        if (pathname.includes('/editar')) {
          router.push('/admin')
        } else {
          // Se estiver no dashboard, apenas atualiza a página
          router.refresh()
        }
      } else {
        toast.error(`Erro ao excluir tese: ${result?.error || 'Erro desconhecido'}`)
      }
    } catch (error: any) {
      console.error("Error deleting thesis:", error)
      toast.error(`Erro ao excluir tese: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a tese <strong>{thesisTitle}</strong>? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
