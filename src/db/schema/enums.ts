import { pgEnum } from "drizzle-orm/pg-core"

export const statusPedidoEnum = pgEnum("status_pedido", ["pendente", "aprovado", "enviado", "entregue", "cancelado"])

export const metodoPagementoPedidoEnum = pgEnum("metodo_pagamento_pedido", ["numerario", "cartao", "conta_movel", "cheque"])

export const tipoMovimentacaoEstoqueEnum = pgEnum("tipo_movimentacao_estoque", ["entrada", "saida", "ajuste"])

export const motivoMovimentacaoEstoqueEnum = pgEnum("motivo_movimentacao_estoque", [
  "compra",
  "venda",
  "transferencia",
  "perda",
  "dano",
])

export const statusProdutoEnum = pgEnum("status_produto", ["ativo", "inativo", "estoque_baixo", "sem_estoque"])

export const statusFornecedorEnum = pgEnum("status_fornecedor", ["ativo", "inativo"])

export const tipoAcaoLogEnum = pgEnum("tipo_acao_log", ["criou", "atualizou", "deletou", "movimentou", "visualizou"])

export const tipoEntidadeLogEnum = pgEnum("tipo_entidade_log", [
  "usuario",
  "produto",
  "fornecedor",
  "movimentacao_estoque",
  "pedido",
  "item_pedido",
])
