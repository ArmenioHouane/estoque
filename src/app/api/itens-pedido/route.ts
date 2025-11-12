import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../db"
import { itemPedidoSchema } from "../../../../src/db/schema/item-pedido"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const itens = await db.select().from(itemPedidoSchema)
    return NextResponse.json(successResponse(itens))
  } catch (error) {
    console.error("Erro ao buscar itens de pedido:", error)
    return NextResponse.json(errorResponse("Erro ao buscar itens de pedido"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quantidade, precoUnitario, subtotal, pedidoId, produtoId } = body

    if (!quantidade || !precoUnitario || !subtotal || !pedidoId || !produtoId) {
      return NextResponse.json(
        errorResponse("Campos obrigatórios: quantidade, precoUnitario, subtotal, pedidoId, produtoId"),
        { status: 400 },
      )
    }

    const resultado = await db
      .insert(itemPedidoSchema)
      .values({
        quantidade,
        precoUnitario,
        subtotal,
        pedidoId,
        produtoId,
      })
      .returning()

    return NextResponse.json(successResponse(resultado[0], "Item de pedido criado com sucesso"), { status: 201 })
  } catch (error) {
    console.error("Erro ao criar item de pedido:", error)
    return NextResponse.json(errorResponse("Erro ao criar item de pedido"), { status: 500 })
  }
}
