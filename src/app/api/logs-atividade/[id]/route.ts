import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../db"
import { logDeAtividadeSchema } from "../../../../../src/db/schema/log-de-atividade"
import { errorResponse, successResponse } from "@/lib/api-response"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const log = await db.select().from(logDeAtividadeSchema).where(eq(logDeAtividadeSchema.id, id)).limit(1)

    if (log.length === 0) {
      return NextResponse.json(errorResponse("Log de atividade não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(log[0]))
  } catch (error) {
    console.error("Erro ao buscar log de atividade:", error)
    return NextResponse.json(errorResponse("Erro ao buscar log de atividade"), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await db.delete(logDeAtividadeSchema).where(eq(logDeAtividadeSchema.id, id)).returning()

    if (resultado.length === 0) {
      return NextResponse.json(errorResponse("Log de atividade não encontrado"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Log de atividade deletado com sucesso"))
  } catch (error) {
    console.error("Erro ao deletar log de atividade:", error)
    return NextResponse.json(errorResponse("Erro ao deletar log de atividade"), { status: 500 })
  }
}
