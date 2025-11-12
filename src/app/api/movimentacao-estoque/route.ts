import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../db"
import { movimentacaoEstoqueSchema } from "../../../../src/db/schema/movimentacao-estoque"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const movimentacoes = await db.select().from(movimentacaoEstoqueSchema)
    return NextResponse.json(successResponse(movimentacoes))
  } catch (error) {
    console.error("Erro ao buscar movimentações de estoque:", error)
    return NextResponse.json(errorResponse("Erro ao buscar movimentações de estoque"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, quantidade, estoqueAnterior, estoqueNovo, motivo, referencia, notas, produtoId, usuarioId } = body

    if (
      !tipo ||
      !quantidade ||
      estoqueAnterior === undefined ||
      estoqueNovo === undefined ||
      !motivo ||
      !produtoId ||
      !usuarioId
    ) {
      return NextResponse.json(errorResponse("Campos obrigatórios faltando"), { status: 400 })
    }

    const resultado = await db
      .insert(movimentacaoEstoqueSchema)
      .values({
        tipo,
        quantidade,
        estoqueAnterior,
        estoqueNovo,
        motivo,
        referencia,
        notas,
        produtoId,
        usuarioId,
      })
      .returning()

    return NextResponse.json(successResponse(resultado[0], "Movimentação de estoque criada com sucesso"), {
      status: 201,
    })
  } catch (error) {
    console.error("Erro ao criar movimentação de estoque:", error)
    return NextResponse.json(errorResponse("Erro ao criar movimentação de estoque"), { status: 500 })
  }
}
