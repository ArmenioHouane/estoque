import { pgEnum } from "drizzle-orm/pg-core"

// Enumerações para tipos de dado
export const tipoMovimentacaoEnum = pgEnum("tipo_movimentacao", ["ENTRADA", "SAIDA", "AJUSTE"])
export const statusPedidoEnum = pgEnum("status_pedido", ["PENDENTE", "APROVADO", "ENVIADO", "ENTREGUE", "CANCELADO"])
export const metodosPagamentoEnum = pgEnum("metodos_pagamento", ["NUMERARIO", "CARTAO", "CONTA_MOVEL", "CHEQUE"])
export const statusProdutoEnum = pgEnum("status_produto", ["ATIVO", "INATIVO", "ESTOQUE_BAIXO", "SEM_ESTOQUE"])
export const statusFornecedorEnum = pgEnum("status_fornecedor", ["ATIVO", "INATIVO"])
export const motiveMovimentacaoEnum = pgEnum("motivo_movimentacao", [
  "COMPRA",
  "VENDA",
  "TRANSFERENCIA",
  "PERDA",
  "DEVOLUCAO",
])
