import { UUID } from 'crypto';
import { PgUUID } from 'drizzle-orm/pg-core';

export interface TrackReqParam {
    slug: string;
    fileString: string;
    downloadUrl: string;
}

export interface Track {
    id?: UUID;
    userId: string;
    slug: string;
    path: string;
    distance: string;
    elevation: string;
    downloadUrl: string;
    downloadTimes: number;
}
