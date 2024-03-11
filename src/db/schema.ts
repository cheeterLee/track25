import { pgTable, timestamp, text, varchar, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: varchar('id', {
        length: 255,
    }).primaryKey(),
    username: text('username').notNull().unique(),
    hashed_password: text('hashed_password').notNull(),
});

export const session = pgTable('session', {
    id: varchar('id', {
        length: 255,
    }).primaryKey(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
});

export const track = pgTable('track', {
    id: uuid('id'),
    user_id: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    path: text('path'),
});
