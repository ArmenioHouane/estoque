import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const usuarioSchema = pgTable("usuario", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  senha: varchar("senha", { length: 255 }).notNull(), // hash da senha
  tokenInvalidadoEm: timestamp("token_invalidado_em"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
