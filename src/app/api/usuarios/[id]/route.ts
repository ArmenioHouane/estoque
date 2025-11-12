import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../db"
import { usuarioSchema } from "../../../../../src/db/schema/usuario"
import { errorResponse, successResponse } from "@/lib/api-response"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const usuario = await db.select().from(usuarioSchema).where(eq(usuarioSchema.id, id)).limit(1)

    if (usuario.length === 0) {
      return NextResponse.json(errorResponse("Usuário não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(usuario[0]))
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return NextResponse.json(errorResponse("Erro ao buscar usuário"), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nome, email, senha } = body

    const resultado = await db
      .update(usuarioSchema)
      .set({
        ...(nome && { nome }),
        ...(email && { email }),
        ...(senha && { senha }),
      })
      .where(eq(usuarioSchema.id, id))
      .returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Usuário não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(resultado[0], "Usuário atualizado com sucesso"))
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error)
    if (error.message?.includes("unique")) {
      return NextResponse.json(errorResponse("Este email já está cadastrado"), { status: 409 })
    }
    return NextResponse.json(errorResponse("Erro ao atualizar usuário"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await db.delete(usuarioSchema).where(eq(usuarioSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Usuário não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Usuário deletado com sucesso"))
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)
    return NextResponse.json(errorResponse("Erro ao deletar usuário"), { status: 500 })
  }
}
