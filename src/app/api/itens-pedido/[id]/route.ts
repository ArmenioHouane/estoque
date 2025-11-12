import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../db"
import { itemPedidoSchema } from "../../../../../src/db/schema/item-pedido"
import { errorResponse, successResponse } from "@/lib/api-response"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await db.select().from(itemPedidoSchema).where(eq(itemPedidoSchema.id, id)).limit(1)

    if (item.length === 0) {
      return NextResponse.json(errorResponse("Item de pedido não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(item[0]))
  } catch (error) {
    console.error("Erro ao buscar item de pedido:", error)
    return NextResponse.json(errorResponse("Erro ao buscar item de pedido"), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const resultado = await db.update(itemPedidoSchema).set(body).where(eq(itemPedidoSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Item de pedido não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(resultado[0], "Item de pedido atualizado com sucesso"))
  } catch (error) {
    console.error("Erro ao atualizar item de pedido:", error)
    return NextResponse.json(errorResponse("Erro ao atualizar item de pedido"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await db.delete(itemPedidoSchema).where(eq(itemPedidoSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Item de pedido não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Item de pedido deletado com sucesso"))
  } catch (error) {
    console.error("Erro ao deletar item de pedido:", error)
    return NextResponse.json(errorResponse("Erro ao deletar item de pedido"), { status: 500 })
  }
}
