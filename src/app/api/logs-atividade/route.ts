import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../db"
import { logDeAtividadeSchema } from "../../../../src/db/schema/log-de-atividade"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const logs = await db.select().from(logDeAtividadeSchema)
    return NextResponse.json(successResponse(logs))
  } catch (error) {
    console.error("Erro ao buscar logs de atividade:", error)
    return NextResponse.json(errorResponse("Erro ao buscar logs de atividade"), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      usuarioId,
      tipoAcao,
      tipoEntidade,
      entidadeId,
      entidadeNome,
      descricao,
      dadosAntigos,
      dadosNovos,
      enderecoIp,
      userAgent,
    } = body

    if (!usuarioId || !tipoAcao || !tipoEntidade || !entidadeId || !entidadeNome) {
      return NextResponse.json(
        errorResponse("Campos obrigatórios: usuarioId, tipoAcao, tipoEntidade, entidadeId, entidadeNome"),
        { status: 400 },
      )
    }

    const resultado = await db
      .insert(logDeAtividadeSchema)
      .values({
        usuarioId,
        tipoAcao,
        tipoEntidade,
        entidadeId,
        entidadeNome,
        descricao,
        dadosAntigos,
        dadosNovos,
        enderecoIp,
        userAgent,
      })
      .returning()

    return NextResponse.json(successResponse(resultado[0], "Log de atividade criado com sucesso"), { status: 201 })
  } catch (error) {
    console.error("Erro ao criar log de atividade:", error)
    return NextResponse.json(errorResponse("Erro ao criar log de atividade"), { status: 500 })
  }
}
