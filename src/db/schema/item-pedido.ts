import { pgTable, integer, numeric, foreignKey, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { pedidoSchema } from "./pedido"
import { produtoSchema } from "./produto"

export const itemPedidoSchema = pgTable(
  "item_pedido",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    quantidade: integer("quantidade").notNull(),
    precoUnitario: numeric("preco_unitario", { precision: 10, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    pedidoId: uuid("pedido_id").notNull(),
    produtoId: uuid("produto_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.pedidoId],
      foreignColumns: [pedidoSchema.id],
      name: "fk_item_pedido_pedido_id",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      columns: [table.produtoId],
      foreignColumns: [produtoSchema.id],
      name: "fk_item_pedido_produto_id",
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ],
)
