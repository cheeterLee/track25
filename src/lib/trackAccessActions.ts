'use server';

import { db } from '@/db';
import { access, accessList, track } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function shareWithUser(
    trackId: string | undefined,
    userIds: string[] | undefined,
) {
    if (!trackId || !userIds) {
        return { success: false, error: 'no trackId or no userIds' };
    }

    const data = await db.query.accessList.findFirst({
        where: eq(accessList.trackId, trackId),
    });

    if (!data) {
        return {
            success: false,
            error: 'cannot find corresponding access list for track',
        };
    }

    for (const userId of userIds) {
        await db.insert(access).values({
            accessListId: data.id,
            userId: userId,
        });
    }

    return { success: true, error: null };
}
