import { pgTable, timestamp, text, varchar } from 'drizzle-orm/pg-core';

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
