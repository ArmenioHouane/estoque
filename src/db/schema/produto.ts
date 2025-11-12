import { pgTable, varchar, numeric, integer, text, timestamp, foreignKey, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { statusProdutoEnum } from "./enums"
import { fornecedorSchema } from "./fornecedor"

export const produtoSchema = pgTable(
  "produto",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    codigo: varchar("codigo", { length: 50 }).notNull().unique(),
    nome: varchar("nome", { length: 255 }).notNull(),
    descricao: text("descricao"),
    categoria: varchar("categoria", { length: 100 }).notNull(),
    precoCompra: numeric("preco_compra", { precision: 10, scale: 2 }).notNull(),
    precoVenda: numeric("preco_venda", { precision: 10, scale: 2 }).notNull(),
    estoqueMinimo: integer("estoque_minimo").notNull().default(0),
    estoqueAtual: integer("estoque_atual").notNull().default(0),
    status: statusProdutoEnum("status").notNull().default("ativo"),
    fornecedorId: uuid("fornecedor_id").notNull(),
    criadoEm: timestamp("criado_em").notNull().defaultNow(),
    atualizadoEm: timestamp("atualizado_em")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      columns: [table.fornecedorId],
      foreignColumns: [fornecedorSchema.id],
      name: "fk_produto_fornecedor_id",
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ],
)
