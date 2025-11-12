import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../db"
import { usuarioSchema } from "../../../../src/db/schema/usuario"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const usuarios = await db.select().from(usuarioSchema)
    return NextResponse.json(successResponse(usuarios))
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json(errorResponse("Erro ao buscar usuários"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, senha } = body

    if (!nome || !email || !senha) {
      return NextResponse.json(errorResponse("Nome, email e senha são obrigatórios"), { status: 400 })
    }

    const resultado = await db.insert(usuarioSchema).values({ nome, email, senha }).returning()

    return NextResponse.json(successResponse(resultado[0], "Usuário criado com sucesso"), {
      status: 201,
    })
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    if (error.message?.includes("unique")) {
      return NextResponse.json(errorResponse("Este email já está cadastrado"), { status: 409 })
    }
    return NextResponse.json(errorResponse("Erro ao criar usuário"), { status: 500 })
  }
}
