import { pgTable, varchar, numeric, text, timestamp, foreignKey, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { statusPedidoEnum, metodoPagementoPedidoEnum } from "./enums"
import { usuarioSchema } from "./usuario"

export const pedidoSchema = pgTable(
  "pedido",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    numeroPedido: varchar("numero_pedido", { length: 50 }).notNull().unique(),
    clienteNome: varchar("cliente_nome", { length: 255 }).notNull(),
    clienteEmail: varchar("cliente_email", { length: 255 }).notNull(),
    clienteTelefone: varchar("cliente_telefone", { length: 20 }),
    clienteEndereco: text("cliente_endereco").notNull(),
    valorTotal: numeric("valor_total", { precision: 10, scale: 2 }).notNull(),
    status: statusPedidoEnum("status").notNull().default("pendente"),
    metodoPagemento: metodoPagementoPedidoEnum("metodo_pagamento").notNull(),
    notas: text("notas"),
    usuarioId: uuid("usuario_id").notNull(),
    criadoEm: timestamp("criado_em").notNull().defaultNow(),
    atualizadoEm: timestamp("atualizado_em")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      columns: [table.usuarioId],
      foreignColumns: [usuarioSchema.id],
      name: "fk_pedido_usuario_id",
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ],
)
