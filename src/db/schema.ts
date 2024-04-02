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

export const invitationTypeEnum = pgEnum('invitation_type', [
    'friend',
    'group',
]);
export const invitationStatusEnum = pgEnum('invitation_status', [
    'pending',
    'accepted',
    'rejected',
]);

export const download = pgTable('download', {
    id: uuid('id').defaultRandom().notNull(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    trackId: uuid('track_id')
        .notNull()
        .references(() => track.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const upload = pgTable('upload', {
    id: uuid('id').defaultRandom().notNull(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    trackId: uuid('track_id')
        .notNull()
        .references(() => track.id),
    createdAt: timestamp('created_at').defaultNow(),
});

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
    subscriptionId: text('subscription_id'),
});

export const friendList = pgTable('friend_list', {
    id: uuid('id').defaultRandom().unique().notNull(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
});

export const friendship = pgTable('friendship', {
    id: uuid('id').primaryKey().defaultRandom(),
    friendListId: uuid('friend_list_id')
        .notNull()
        .references(() => friendList.id),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    friendId: varchar('friend_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    createdAt: timestamp('created_at').defaultNow(),
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
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invitation = pgTable('invitation', {
    id: uuid('id').primaryKey().defaultRandom(),
    senderId: varchar('sender_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    receiverId: varchar('receiver_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
    type: invitationTypeEnum('type'),
    groupId: uuid('group_id').references(() => group.id),
    status: invitationStatusEnum('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const group = pgTable('group', {
    id: uuid('id').primaryKey().defaultRandom().unique(),
    groupName: text('group_name'),
    creatorId: varchar('creator_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
});

export const groupMember = pgTable('group_member', {
    id: uuid('id').primaryKey().defaultRandom(),
    groupId: uuid('group_id')
        .notNull()
        .references(() => group.id),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
});

export const accessList = pgTable('access_list', {
    id: uuid('id').defaultRandom().unique().notNull(),
    trackId: uuid('track_id')
        .notNull()
        .references(() => track.id),
});

export const access = pgTable('access', {
    id: uuid('id').defaultRandom().notNull(),
    accessListId: uuid('access_list_id')
        .notNull()
        .references(() => accessList.id),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => user.id),
});

//  ===== Relations =====
export const userRelations = relations(user, ({ many }) => ({
    tracks: many(track),
}));

export const trackRelations = relations(track, ({ one }) => ({
    owner: one(user, {
        fields: [track.userId],
        references: [user.id],
    }),
    accessList: one(accessList, {
        fields: [track.id],
        references: [accessList.trackId],
    }),
}));

export const friendListRelations = relations(friendList, ({ many, one }) => ({
    friendship: many(friendship),
    owner: one(user, {
        fields: [friendList.userId],
        references: [user.id],
    }),
}));

export const friendshipRelations = relations(friendship, ({ one }) => ({
    friendList: one(friendList, {
        fields: [friendship.friendListId],
        references: [friendList.id],
    }),
    friend: one(user, {
        fields: [friendship.friendId],
        references: [user.id],
    }),
}));

export const groupRelations = relations(group, ({ many, one }) => ({
    groupMembers: many(groupMember),
    creator: one(user, {
        fields: [group.creatorId],
        references: [user.id],
    }),
}));

export const groupMemberRelations = relations(groupMember, ({ one }) => ({
    group: one(group, {
        fields: [groupMember.groupId],
        references: [group.id],
    }),
    member: one(user, {
        fields: [groupMember.userId],
        references: [user.id],
    }),
}));

export const accessListRelations = relations(accessList, ({ many, one }) => ({
    access: many(access),
    accessToTrack: one(track, {
        fields: [accessList.trackId],
        references: [track.id],
    }),
}));

export const accessRelations = relations(access, ({ one }) => ({
    accessList: one(accessList, {
        fields: [access.accessListId],
        references: [accessList.id],
    }),
    userWithAccess: one(user, {
        fields: [access.userId],
        references: [user.id],
    }),
}));
