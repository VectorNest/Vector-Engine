CREATE TABLE "blockchain_transactions" (
	"height" bigint NOT NULL,
	"hash" varchar(70) NOT NULL,
	"is_processed" boolean NOT NULL,
	CONSTRAINT "blockchain_transactions_height_hash_pk" PRIMARY KEY("height","hash")
);
--> statement-breakpoint
CREATE TABLE "detail_files" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "detail_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cid" varchar(100) NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "detail_files_cid_unique" UNIQUE("cid")
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "product_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"address" varchar(100) NOT NULL,
	CONSTRAINT "product_categories_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" integer PRIMARY KEY NOT NULL,
	"owner_address" varchar(65) NOT NULL,
	CONSTRAINT "providers_owner_address_unique" UNIQUE("owner_address")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"owner_address" varchar(100) NOT NULL,
	"details" json DEFAULT '{}'::json NOT NULL,
	"deployment_status" varchar(20) NOT NULL,
	"group_name" varchar(100) DEFAULT 'default' NOT NULL,
	"offer_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"provider_id" integer NOT NULL,
	"pc_address_id" integer NOT NULL,
	CONSTRAINT "resources_id_pc_address_id_pk" PRIMARY KEY("id","pc_address_id")
);
--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_pc_address_id_product_categories_id_fk" FOREIGN KEY ("pc_address_id") REFERENCES "public"."product_categories"("id") ON DELETE no action ON UPDATE no action;