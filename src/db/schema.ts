import { relations } from 'drizzle-orm';
import {
    pgTable,
    timestamp,
    text,
    varchar,
    uuid,
    integer,
    pgEnum,
    boolean,
} from 'drizzle-orm/pg-core';

export const tariffEnum = pgEnum('tariff', [
    'free',
    'monthly',
    'quarterly',
    'yearly',
]);

export const user = pgTable('user', {
    id: varchar('id', {
        length: 255,
    })
        .primaryKey()
        .notNull(),
    username: text('username').notNull().unique(),
    hashed_password: text('hashed_password').notNull(),
    isPremium: boolean('is_premium').default(false),
    tariff: tariffEnum('tariff').default('free'),
    subscriptionId: text('subscriptionId'),
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

export const subscription = pgTable('subscription', {
    id: text('id').primaryKey().notNull(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    type: tariffEnum('type'),
    timestamp: timestamp('created_at').defaultNow().notNull(),
});

export const upload = pgTable('upload', {
    id: text('id').primaryKey().notNull(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    totalCount: integer('total_count').default(0),
});

export const download = pgTable('download', {
    id: text('id').primaryKey().notNull(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    totalCount: integer('total_count').default(0),
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
