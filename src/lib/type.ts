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

export interface SharedTrack {
    id: string;
    accessList: {
        accessToTrack: Track & {
            owner: {
                username: string;
            };
        };
    };
}

export interface Plan {
    id: string;
    name: string;
    priceStr: string;
}

export interface User {
    tariff: 'free' | 'monthly' | 'quarterly' | 'yearly' | null;
    id: string;
    username: string;
    hashed_password: string;
    isPremium: boolean | null;
    subscriptionId: string | null;
}
