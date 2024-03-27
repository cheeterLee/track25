'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type TrackStore, createTrackStore } from '@/stores/trackStore';

export const TrackStoreContext = createContext<StoreApi<TrackStore> | null>(
    null,
);

export interface TrackStoreProviderProps {
    children: ReactNode;
}

export const TrackStoreProvider = ({ children }: TrackStoreProviderProps) => {
    const storeRef = useRef<StoreApi<TrackStore>>();
    if (!storeRef.current) {
        storeRef.current = createTrackStore();
    }
    return (
        <TrackStoreContext.Provider value={storeRef.current}>
            {children}
        </TrackStoreContext.Provider>
    );
};

export const useTrackStore = <T,>(selector: (store: TrackStore) => T): T => {
    const trackStoreContext = useContext(TrackStoreContext);

    if (!trackStoreContext) {
        throw new Error('useTrackStore must be used within TrackStoreProvider');
    }

    return useStore(trackStoreContext, selector);
};
