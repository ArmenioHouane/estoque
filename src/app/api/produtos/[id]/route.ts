import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../db"
import { produtoSchema } from "../../../../../src/db/schema/produto"
import { errorResponse, successResponse } from "@/lib/api-response"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const produto = await db.select().from(produtoSchema).where(eq(produtoSchema.id, id)).limit(1)

    if (produto.length === 0) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(produto[0]))
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return NextResponse.json(errorResponse("Erro ao buscar produto"), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const resultado = await db.update(produtoSchema).set(body).where(eq(produtoSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(resultado[0], "Produto atualizado com sucesso"))
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json(errorResponse("Erro ao atualizar produto"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await db.delete(produtoSchema).where(eq(produtoSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Produto não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Produto deletado com sucesso"))
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return NextResponse.json(errorResponse("Erro ao deletar produto"), { status: 500 })
  }
}
