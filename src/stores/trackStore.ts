import { createStore } from 'zustand/vanilla';

export type TrackState = {
    dataToShow: 'my' | 'all';
};

export type TrackActions = {
    selectMyTracks: () => void;
    selectAllTracks: () => void;
};

export type TrackStore = TrackActions & TrackState;

export const defaultInitState: TrackState = {
    dataToShow: 'my',
};

export const createTrackStore = (initState: TrackState = defaultInitState) => {
    return createStore<TrackStore>()((set) => ({
        ...initState,
        selectAllTracks: () => set((state) => ({ dataToShow: 'all' })),
        selectMyTracks: () => set((state) => ({ dataToShow: 'my' })),
    }));
};
