import type * as z from 'zod'

import { pgTable } from 'drizzle-orm/pg-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'

export const posts = pgTable('posts', (t) => ({
  id: t.serial().primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}))

export const postSelectSchema = createSelectSchema(posts)
export type PostSelect = z.infer<typeof postSelectSchema>

export const postInsertSchema = createInsertSchema(posts)
export type PostInsert = z.infer<typeof postInsertSchema>

export const postUpdateSchema = createUpdateSchema(posts)
export type PostUpdate = z.infer<typeof postUpdateSchema>
