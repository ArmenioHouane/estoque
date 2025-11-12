import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../db"
import { pedidoSchema } from "../../../../src/db/schema/pedido"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const pedidos = await db.select().from(pedidoSchema)
    return NextResponse.json(successResponse(pedidos))
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json(errorResponse("Erro ao buscar pedidos"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      numeroPedido,
      clienteNome,
      clienteEmail,
      clienteTelefone,
      clienteEndereco,
      valorTotal,
      metodoPagemento,
      usuarioId,
      notas,
      status,
    } = body

    if (
      !numeroPedido ||
      !clienteNome ||
      !clienteEmail ||
      !clienteEndereco ||
      !valorTotal ||
      !metodoPagemento ||
      !usuarioId
    ) {
      return NextResponse.json(errorResponse("Campos obrigatórios faltando"), { status: 400 })
    }

    const resultado = await db
      .insert(pedidoSchema)
      .values({
        numeroPedido,
        clienteNome,
        clienteEmail,
        clienteTelefone,
        clienteEndereco,
        valorTotal,
        metodoPagemento,
        usuarioId,
        notas,
        status: status || "pendente",
      })
      .returning()

    return NextResponse.json(successResponse(resultado[0], "Pedido criado com sucesso"), { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error)
    if (error.message?.includes("unique")) {
      return NextResponse.json(errorResponse("Este número de pedido já existe"), { status: 409 })
    }
    return NextResponse.json(errorResponse("Erro ao criar pedido"), { status: 500 })
  }
}
