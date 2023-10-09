import { serial, text, pgTable } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';

export const admin = pgTable('admin', {
  id: serial('id').primaryKey(),
  email: text('email').primaryKey(),
  password: text('password'),
  name: text('name'),
});

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  email: text('email').primaryKey(),
  password: text('password'),
  name: text('name'),
});
