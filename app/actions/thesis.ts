"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function createThesis(data: {
  title: string
  description: string
  content: string
  categoryId: string
  authorId: string
  published?: boolean
  coverImage?: string
  coverImagePosition?: string
}) {
  try {
    console.log("Creating thesis with data:", data)
    const slug = generateSlug(data.title)
    
    const thesis = await prisma.thesis.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        coverImage: data.coverImage || null,
        coverImagePosition: data.coverImagePosition || "center",
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
        categoryId: data.categoryId,
        authorId: data.authorId,
      },
    })

    console.log("Thesis created successfully:", thesis.id)
    revalidatePath("/teses")
    revalidatePath("/admin")

    return { success: true, thesis }
  } catch (error: any) {
    console.error("Error creating thesis:", error)
    return { success: false, error: error.message }
  }
}

export async function updateThesis(id: string, data: {
  title: string
  description: string
  content: string
  categoryId: string
  published?: boolean
  coverImage?: string
  coverImagePosition?: string
}) {
  try {
    console.log("Updating thesis:", id, data)
    const slug = generateSlug(data.title)
    
    const thesis = await prisma.thesis.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        coverImage: data.coverImage || null,
        coverImagePosition: data.coverImagePosition || "center",
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
        categoryId: data.categoryId,
      },
    })

    console.log("Thesis updated successfully:", thesis.id)
    revalidatePath("/teses")
    revalidatePath(`/teses/${thesis.slug}`)
    revalidatePath("/admin")

    return { success: true, thesis }
  } catch (error: any) {
    console.error("Error updating thesis:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteThesis(id: string) {
  try {
    await prisma.thesis.delete({ where: { id } })
    revalidatePath("/teses")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting thesis:", error)
    return { success: false, error: error.message }
  }
}

export async function incrementThesisViews(slug: string) {
  try {
    await prisma.thesis.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    })
    return { success: true }
  } catch (error: any) {
    console.error("Error incrementing views:", error)
    return { success: false, error: error.message }
  }
}