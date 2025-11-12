import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../db"
import { fornecedorSchema } from "../../../../src/db/schema/fornecedor"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const fornecedores = await db.select().from(fornecedorSchema)
    return NextResponse.json(successResponse(fornecedores))
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error)
    return NextResponse.json(errorResponse("Erro ao buscar fornecedores"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, contatoNome, email, telefone, endereco, status } = body

    if (!nome) {
      return NextResponse.json(errorResponse("Nome é obrigatório"), { status: 400 })
    }

    const resultado = await db
      .insert(fornecedorSchema)
      .values({
        nome,
        contatoNome,
        email,
        telefone,
        endereco,
        status: status || "ativo",
      })
      .returning()

    return NextResponse.json(successResponse(resultado[0], "Fornecedor criado com sucesso"), { status: 201 })
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error)
    return NextResponse.json(errorResponse("Erro ao criar fornecedor"), { status: 500 })
  }
}
