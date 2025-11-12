import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type {
  usuarioSchema,
  fornecedorSchema,
  produtoSchema,
  pedidoSchema,
  itemPedidoSchema,
  movimentacaoEstoqueSchema,
  logDeAtividadeSchema,
} from "./schema"

// Usuario Types
export type Usuario = InferSelectModel<typeof usuarioSchema>
export type UsuarioInsert = InferInsertModel<typeof usuarioSchema>

// Fornecedor Types
export type Fornecedor = InferSelectModel<typeof fornecedorSchema>
export type FornecedorInsert = InferInsertModel<typeof fornecedorSchema>

// Produto Types
export type Produto = InferSelectModel<typeof produtoSchema>
export type ProdutoInsert = InferInsertModel<typeof produtoSchema>

// Pedido Types
export type Pedido = InferSelectModel<typeof pedidoSchema>
export type PedidoInsert = InferInsertModel<typeof pedidoSchema>

// ItemPedido Types
export type ItemPedido = InferSelectModel<typeof itemPedidoSchema>
export type ItemPedidoInsert = InferInsertModel<typeof itemPedidoSchema>

// MovimentacaoEstoque Types
export type MovimentacaoEstoque = InferSelectModel<typeof movimentacaoEstoqueSchema>
export type MovimentacaoEstoqueInsert = InferInsertModel<typeof movimentacaoEstoqueSchema>

// LogDeAtividade Types
export type LogDeAtividade = InferSelectModel<typeof logDeAtividadeSchema>
export type LogDeAtividadeInsert = InferInsertModel<typeof logDeAtividadeSchema>
