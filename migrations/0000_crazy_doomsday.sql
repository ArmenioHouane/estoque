CREATE TYPE "public"."metodo_pagamento_pedido" AS ENUM('numerario', 'cartao', 'conta_movel', 'cheque');--> statement-breakpoint
CREATE TYPE "public"."motivo_movimentacao_estoque" AS ENUM('compra', 'venda', 'transferencia', 'perda', 'dano');--> statement-breakpoint
CREATE TYPE "public"."status_fornecedor" AS ENUM('ativo', 'inativo');--> statement-breakpoint
CREATE TYPE "public"."status_pedido" AS ENUM('pendente', 'aprovado', 'enviado', 'entregue', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."status_produto" AS ENUM('ativo', 'inativo', 'estoque_baixo', 'sem_estoque');--> statement-breakpoint
CREATE TYPE "public"."tipo_acao_log" AS ENUM('criou', 'atualizou', 'deletou', 'movimentou', 'visualizou');--> statement-breakpoint
CREATE TYPE "public"."tipo_entidade_log" AS ENUM('usuario', 'produto', 'fornecedor', 'movimentacao_estoque', 'pedido', 'item_pedido');--> statement-breakpoint
CREATE TYPE "public"."tipo_movimentacao_estoque" AS ENUM('entrada', 'saida', 'ajuste');--> statement-breakpoint
CREATE TABLE "fornecedor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(255) NOT NULL,
	"contato_nome" varchar(255),
	"contato_funcao" varchar(255),
	"email" varchar(255),
	"telefone" varchar(20),
	"celular" varchar(20),
	"website" varchar(255),
	"endereco" text,
	"notas" text,
	"status" "status_fornecedor" DEFAULT 'ativo' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_pedido" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quantidade" integer NOT NULL,
	"preco_unitario" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"pedido_id" uuid NOT NULL,
	"produto_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "log_de_atividade" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"tipo_acao" "tipo_acao_log" NOT NULL,
	"tipo_entidade" "tipo_entidade_log" NOT NULL,
	"entidade_id" varchar(36) NOT NULL,
	"entidade_nome" varchar(255) NOT NULL,
	"descricao" text,
	"dados_antigos" text,
	"dados_novos" text,
	"endereco_ip" varchar(45),
	"user_agent" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movimentacao_estoque" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo" "tipo_movimentacao_estoque" NOT NULL,
	"quantidade" integer NOT NULL,
	"estoque_anterior" integer NOT NULL,
	"estoque_novo" integer NOT NULL,
	"motivo" "motivo_movimentacao_estoque" NOT NULL,
	"referencia" varchar(100),
	"notas" text,
	"produto_id" uuid NOT NULL,
	"usuario_id" uuid NOT NULL,
	"data" timestamp DEFAULT now() NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedido" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_pedido" varchar(50) NOT NULL,
	"cliente_nome" varchar(255) NOT NULL,
	"cliente_email" varchar(255) NOT NULL,
	"cliente_telefone" varchar(20),
	"cliente_endereco" text NOT NULL,
	"valor_total" numeric(10, 2) NOT NULL,
	"status" "status_pedido" DEFAULT 'pendente' NOT NULL,
	"metodo_pagamento" "metodo_pagamento_pedido" NOT NULL,
	"notas" text,
	"usuario_id" uuid NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pedido_numero_pedido_unique" UNIQUE("numero_pedido")
);
--> statement-breakpoint
CREATE TABLE "produto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo" varchar(50) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"categoria" varchar(100) NOT NULL,
	"preco_compra" numeric(10, 2) NOT NULL,
	"preco_venda" numeric(10, 2) NOT NULL,
	"estoque_minimo" integer DEFAULT 0 NOT NULL,
	"estoque_atual" integer DEFAULT 0 NOT NULL,
	"status" "status_produto" DEFAULT 'ativo' NOT NULL,
	"fornecedor_id" uuid NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "produto_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"senha" varchar(255) NOT NULL,
	"token_invalidado_em" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuario_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "item_pedido" ADD CONSTRAINT "fk_item_pedido_pedido_id" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedido"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_pedido" ADD CONSTRAINT "fk_item_pedido_produto_id" FOREIGN KEY ("produto_id") REFERENCES "public"."produto"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "log_de_atividade" ADD CONSTRAINT "fk_log_atividade_usuario_id" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimentacao_estoque" ADD CONSTRAINT "fk_movimentacao_estoque_produto_id" FOREIGN KEY ("produto_id") REFERENCES "public"."produto"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "movimentacao_estoque" ADD CONSTRAINT "fk_movimentacao_estoque_usuario_id" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pedido" ADD CONSTRAINT "fk_pedido_usuario_id" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "produto" ADD CONSTRAINT "fk_produto_fornecedor_id" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedor"("id") ON DELETE restrict ON UPDATE cascade;