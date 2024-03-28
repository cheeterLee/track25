import { createStore } from 'zustand/vanilla';

export type TrackState = {
    dataToShow: 'my' | 'all';
    justUploaded: boolean;
    trackToView: string;
};

export type TrackActions = {
    selectMyTracks: () => void;
    selectAllTracks: () => void;
    setJustUploadedTrue: () => void;
    setJustUploadedFalse: () => void;
    setTrackToView: (slug: string) => void;
};

export type TrackStore = TrackActions & TrackState;

export const defaultInitState: TrackState = {
    dataToShow: 'my',
    justUploaded: false,
    trackToView: '',
};

export const createTrackStore = (initState: TrackState = defaultInitState) => {
    return createStore<TrackStore>()((set) => ({
        ...initState,
        selectAllTracks: () =>
            set((state) => ({ ...state, dataToShow: 'all' })),
        selectMyTracks: () => set((state) => ({ ...state, dataToShow: 'my' })),
        setJustUploadedTrue: () =>
            set((state) => ({ ...state, justUploaded: true })),
        setJustUploadedFalse: () =>
            set((state) => ({ ...state, justUploaded: false })),
        setTrackToView: (slug: string) =>
            set((state) => ({ ...state, trackToView: slug })),
    }));
};
