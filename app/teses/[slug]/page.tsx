import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TeseClientPage } from "@/app/teses/[slug]/client"

export const dynamic = 'force-dynamic'

async function getThesis(slug: string) {
  const thesis = await prisma.thesis.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      author: true,
      media: {
        orderBy: { position: "asc" },
      },
    },
  })
  return thesis
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const thesis = await getThesis(slug)

  if (!thesis) {
    return {
      title: "Tese não encontrada",
    }
  }
  return {
    title: `${thesis.title} | Ricardo Lopes de Souza`,
    description: thesis.description,
  }
}

export default async function TesePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const thesis = await getThesis(slug)

  if (!thesis) {
    notFound()
  }

  const serializedThesis = {
    ...thesis,
    createdAt: thesis.createdAt.toISOString(),
    updatedAt: thesis.updatedAt.toISOString(),
    content: (() => {
      try {
        if (typeof thesis.content === 'string') {
          return JSON.parse(thesis.content)
        }
        if (typeof thesis.content === 'object' && thesis.content !== null) {
          return thesis.content
        }
        return { type: 'doc', content: [] }
      } catch (error) {
        console.error('Error parsing content:', error)
        return { type: 'doc', content: [] }
      }
    })(),
    category: {
      ...thesis.category,
      createdAt: thesis.category.createdAt.toISOString(),
      updatedAt: thesis.category.updatedAt.toISOString(),
    },
    author: {
      ...thesis.author,
      createdAt: thesis.author.createdAt.toISOString(),
      updatedAt: thesis.author.updatedAt.toISOString(),
    },
    media: thesis.media.map(media => ({
      ...media,
      createdAt: media.createdAt.toISOString(),
    })),
  }

  return <TeseClientPage thesis={serializedThesis} />
}