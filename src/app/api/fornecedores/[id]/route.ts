import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../db"
import { fornecedorSchema } from "../../../../../src/db/schema/fornecedor"
import { errorResponse, successResponse } from "@/lib/api-response"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const fornecedor = await db.select().from(fornecedorSchema).where(eq(fornecedorSchema.id, id)).limit(1)

    if (fornecedor.length === 0) {
      return NextResponse.json(errorResponse("Fornecedor não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(fornecedor[0]))
  } catch (error) {
    console.error("Erro ao buscar fornecedor:", error)
    return NextResponse.json(errorResponse("Erro ao buscar fornecedor"), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const resultado = await db.update(fornecedorSchema).set(body).where(eq(fornecedorSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Fornecedor não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(resultado[0], "Fornecedor atualizado com sucesso"))
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error)
    return NextResponse.json(errorResponse("Erro ao atualizar fornecedor"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await db.delete(fornecedorSchema).where(eq(fornecedorSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Fornecedor não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Fornecedor deletado com sucesso"))
  } catch (error) {
    console.error("Erro ao deletar fornecedor:", error)
    return NextResponse.json(errorResponse("Erro ao deletar fornecedor"), { status: 500 })
  }
}
