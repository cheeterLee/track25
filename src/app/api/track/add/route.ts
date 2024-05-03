import { NextResponse } from 'next/server';
import { DOMParser } from 'xmldom';
import { db } from '@/db';
// @ts-ignore
import toGeoJson from '@mapbox/togeojson';
import { Track, TrackReqParam } from '@/lib/type';
// @ts-ignore
import length from '@turf/length';
import { access, accessList, track, upload, user } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';

export async function POST(request: Request): Promise<NextResponse> {
    const data: TrackReqParam = await request.json();
    const { slug, fileString, downloadUrl } = data;

    // ========= parse ===========
    const source = new DOMParser().parseFromString(fileString);
    const fileGeoJson: any = await toGeoJson.gpx(source); // may cause issue
    const geoJsonString = JSON.stringify(fileGeoJson);
    const distance = length(fileGeoJson);
    const { coordinates } = fileGeoJson.features[0].geometry;
    let elevation = 0;
    coordinates.forEach((coord: any, index: any) => {
        if (index === coordinates.length - 1) return; // stop 1 point early since comparison requires 2 points
        const elevationDifference =
            coordinates[index + 1][2] - coordinates[index][2];
        if (elevationDifference > 0) {
            elevation += elevationDifference;
        }
    });
    // ===========================
    const { user: authUser } = await validateRequest();

    if (!authUser) {
        return NextResponse.json({ code: 400 });
    }

    const d = await db.select().from(user).where(eq(user.id, authUser.id));
    const currUploads = await db
        .select()
        .from(upload)
        .where(eq(upload.userId, authUser.id));
    if (d[0].isPremium === false && currUploads.length === 5) {
        return NextResponse.json({ code: 601 });
    }

    const param: Track = {
        slug: slug,
        userId: authUser.id,
        path: geoJsonString,
        distance: Number(distance).toFixed(2),
        elevation: Number(elevation).toFixed(2),
        downloadUrl: downloadUrl,
        downloadTimes: 0,
    };

    // create track
    const { id: trackId } = (
        await db.insert(track).values(param).returning()
    )[0];

    // create access list for the track
    const { id: accessListId } = (
        await db
            .insert(accessList)
            .values({
                trackId: trackId,
            })
            .returning()
    )[0];

    // add current user access
    await db.insert(access).values({
        accessListId: accessListId,
        userId: authUser.id,
    });

    await db.insert(upload).values({
        userId: authUser.id,
        trackId: trackId,
    });

    return NextResponse.json({ code: 200 });
}
