CREATE TABLE "sys_user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"username" varchar(64) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"nickname" varchar(64),
	"real_name" varchar(64),
	"email" varchar(128),
	"phone" varchar(32),
	"avatar" varchar(255),
	"gender" smallint DEFAULT 0,
	"status" smallint DEFAULT 1 NOT NULL,
	"is_super_admin" smallint DEFAULT 0 NOT NULL,
	"last_login_ip" varchar(64),
	"last_login_at" timestamp,
	"remark" varchar(255),
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" smallint DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uk_tenant_username" ON "sys_user" USING btree ("tenant_id","username");--> statement-breakpoint
CREATE INDEX "idx_tenant_status" ON "sys_user" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_tenant_phone" ON "sys_user" USING btree ("tenant_id","phone");