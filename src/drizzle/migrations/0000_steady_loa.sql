CREATE TABLE IF NOT EXISTS "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text PRIMARY KEY NOT NULL,
	"password" text,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text PRIMARY KEY NOT NULL,
	"password" text,
	"name" text
);
