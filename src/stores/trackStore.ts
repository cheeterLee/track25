import { createStore } from 'zustand/vanilla';

export type TrackState = {
    dataToShow: 'my' | 'all';
    justUploaded: boolean;
};

export type TrackActions = {
    selectMyTracks: () => void;
    selectAllTracks: () => void;
    setJustUploadedTrue: () => void;
    setJustUploadedFalse: () => void;
};

export type TrackStore = TrackActions & TrackState;

export const defaultInitState: TrackState = {
    dataToShow: 'my',
    justUploaded: false,
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
    }));
};
