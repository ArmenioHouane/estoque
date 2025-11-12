import { pgTable, varchar, integer, text, timestamp, foreignKey, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { tipoMovimentacaoEstoqueEnum, motivoMovimentacaoEstoqueEnum } from "./enums"
import { produtoSchema } from "./produto"
import { usuarioSchema } from "./usuario"

export const movimentacaoEstoqueSchema = pgTable(
  "movimentacao_estoque",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    tipo: tipoMovimentacaoEstoqueEnum("tipo").notNull(),
    quantidade: integer("quantidade").notNull(),
    estoqueAnterior: integer("estoque_anterior").notNull(),
    estoqueNovo: integer("estoque_novo").notNull(),
    motivo: motivoMovimentacaoEstoqueEnum("motivo").notNull(),
    referencia: varchar("referencia", { length: 100 }),
    notas: text("notas"),
    produtoId: uuid("produto_id").notNull(),
    usuarioId: uuid("usuario_id").notNull(),
    data: timestamp("data").notNull().defaultNow(),
    criadoEm: timestamp("criado_em").notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.produtoId],
      foreignColumns: [produtoSchema.id],
      name: "fk_movimentacao_estoque_produto_id",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      columns: [table.usuarioId],
      foreignColumns: [usuarioSchema.id],
      name: "fk_movimentacao_estoque_usuario_id",
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ],
)
