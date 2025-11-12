import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { statusFornecedorEnum } from "./enums"

export const fornecedorSchema = pgTable("fornecedor", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: varchar("nome", { length: 255 }).notNull(),
  contatoNome: varchar("contato_nome", { length: 255 }),
  contatoFuncao: varchar("contato_funcao", { length: 255 }),
  email: varchar("email", { length: 255 }),
  telefone: varchar("telefone", { length: 20 }),
  celular: varchar("celular", { length: 20 }),
  website: varchar("website", { length: 255 }),
  endereco: text("endereco"),
  notas: text("notas"),
  status: statusFornecedorEnum("status").notNull().default("ativo"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
