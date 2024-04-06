'use server';

import { db } from '@/db';
import { validateRequest } from '../lib/auth';
import { download, track } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function addDownloadLog(
    trackId: string | undefined,
    downloadTimes: number | undefined,
) {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, error: 'no user' };
    }
    if (trackId === undefined || downloadTimes === undefined) {
        return { success: false, error: 'no trackId or no downloadTimes' };
    }

    await db
        .update(track)
        .set({
            downloadTimes: downloadTimes + 1,
        })
        .where(eq(track.id, trackId));

    await db.insert(download).values({
        trackId: trackId,
        userId: user.id,
    });

    return { success: true, error: null };
}
