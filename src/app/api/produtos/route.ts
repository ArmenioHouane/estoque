import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../db"
import { produtoSchema } from "../../../../src/db/schema/produto"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const produtos = await db.select().from(produtoSchema)
    return NextResponse.json(successResponse(produtos))
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json(errorResponse("Erro ao buscar produtos"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      codigo,
      nome,
      descricao,
      categoria,
      precoCompra,
      precoVenda,
      estoqueMinimo,
      estoqueAtual,
      fornecedorId,
      status,
    } = body

    if (!codigo || !nome || !categoria || !precoCompra || !precoVenda || !fornecedorId) {
      return NextResponse.json(
        errorResponse("Campos obrigatórios: codigo, nome, categoria, precoCompra, precoVenda, fornecedorId"),
        { status: 400 },
      )
    }

    const resultado = await db
      .insert(produtoSchema)
      .values({
        codigo,
        nome,
        descricao,
        categoria,
        precoCompra,
        precoVenda,
        estoqueMinimo: estoqueMinimo || 0,
        estoqueAtual: estoqueAtual || 0,
        fornecedorId,
        status: status || "ativo",
      })
      .returning()

    return NextResponse.json(successResponse(resultado[0], "Produto criado com sucesso"), { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar produto:", error)
    if (error.message?.includes("unique")) {
      return NextResponse.json(errorResponse("Este código já está cadastrado"), { status: 409 })
    }
    return NextResponse.json(errorResponse("Erro ao criar produto"), { status: 500 })
  }
}
