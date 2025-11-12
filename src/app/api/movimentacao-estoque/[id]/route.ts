import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../db"
import { movimentacaoEstoqueSchema } from "../../../../../src/db/schema/movimentacao-estoque"
import { errorResponse, successResponse } from "@/lib/api-response"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const movimentacao = await db
      .select()
      .from(movimentacaoEstoqueSchema)
      .where(eq(movimentacaoEstoqueSchema.id, id))
      .limit(1)

    if (movimentacao.length === 0) {
      return NextResponse.json(errorResponse("Movimentação de estoque não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(movimentacao[0]))
  } catch (error) {
    console.error("Erro ao buscar movimentação de estoque:", error)
    return NextResponse.json(errorResponse("Erro ao buscar movimentação de estoque"), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const resultado = await db
      .update(movimentacaoEstoqueSchema)
      .set(body)
      .where(eq(movimentacaoEstoqueSchema.id, id))
      .returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Movimentação de estoque não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(resultado[0], "Movimentação de estoque atualizada com sucesso"))
  } catch (error) {
    console.error("Erro ao atualizar movimentação de estoque:", error)
    return NextResponse.json(errorResponse("Erro ao atualizar movimentação de estoque"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await db.delete(movimentacaoEstoqueSchema).where(eq(movimentacaoEstoqueSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Movimentação de estoque não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Movimentação de estoque deletada com sucesso"))
  } catch (error) {
    console.error("Erro ao deletar movimentação de estoque:", error)
    return NextResponse.json(errorResponse("Erro ao deletar movimentação de estoque"), { status: 500 })
  }
}
