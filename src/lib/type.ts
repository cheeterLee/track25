export interface TrackReqParam {
    slug: string;
    fileString: string;
    downloadUrl: string;
}

export interface Track {
    id?: string;
    userId: string;
    slug: string;
    path: string;
    distance: string;
    elevation: string;
    downloadUrl: string;
    downloadTimes: number;
}
