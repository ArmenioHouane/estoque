import { pgTable, varchar, timestamp, text, foreignKey, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { tipoAcaoLogEnum, tipoEntidadeLogEnum } from "./enums"
import { usuarioSchema } from "./usuario"

/**
 * Tabela de log de atividades
 * Rastreia todas as ações realizadas no sistema
 * Permite gerar relatórios de auditoria e atividades
 */
export const logDeAtividadeSchema = pgTable(
  "log_de_atividade",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    usuarioId: uuid("usuario_id").notNull(),
    tipoAcao: tipoAcaoLogEnum("tipo_acao").notNull(),
    tipoEntidade: tipoEntidadeLogEnum("tipo_entidade").notNull(),
    entidadeId: varchar("entidade_id", { length: 36 }).notNull(),
    entidadeNome: varchar("entidade_nome", { length: 255 }).notNull(),
    descricao: text("descricao"),
    dadosAntigos: text("dados_antigos"),
    dadosNovos: text("dados_novos"),
    enderecoIp: varchar("endereco_ip", { length: 45 }),
    userAgent: text("user_agent"),
    criadoEm: timestamp("criado_em").notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.usuarioId],
      foreignColumns: [usuarioSchema.id],
      name: "fk_log_atividade_usuario_id",
    }).onDelete("restrict"),
  ],
)
