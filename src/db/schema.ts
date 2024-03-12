import { relations } from 'drizzle-orm';
import {
    pgTable,
    timestamp,
    text,
    varchar,
    uuid,
    decimal,
    integer,
} from 'drizzle-orm/pg-core';

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
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    path: text('path').notNull(),
    slug: text('slug').notNull(),
    downloadUrl: text('download_url').notNull(),
    distance: text('distance').notNull(),
    elevation: text('elevation').notNull(),
    downloadTimes: integer('download_times').notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
    tracks: many(track),
}));

export const trackRelations = relations(track, ({ one }) => ({
    owner: one(user, {
        fields: [track.userId],
        references: [user.id],
    }),
}));
