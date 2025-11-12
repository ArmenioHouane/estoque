import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../db"
import { pedidoSchema } from "../../../../../src/db/schema/pedido"
import { errorResponse, successResponse } from "@/lib/api-response"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const pedido = await db.select().from(pedidoSchema).where(eq(pedidoSchema.id, id)).limit(1)

    if (pedido.length === 0) {
      return NextResponse.json(errorResponse("Pedido não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(pedido[0]))
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return NextResponse.json(errorResponse("Erro ao buscar pedido"), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const resultado = await db.update(pedidoSchema).set(body).where(eq(pedidoSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Pedido não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(resultado[0], "Pedido atualizado com sucesso"))
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error)
    return NextResponse.json(errorResponse("Erro ao atualizar pedido"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await db.delete(pedidoSchema).where(eq(pedidoSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Pedido não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Pedido deletado com sucesso"))
  } catch (error) {
    console.error("Erro ao deletar pedido:", error)
    return NextResponse.json(errorResponse("Erro ao deletar pedido"), { status: 500 })
  }
}
