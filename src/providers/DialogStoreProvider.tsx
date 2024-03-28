'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type DialogStore, createDialogStore } from '@/stores/dialogStore';

export const DialogStoreContext = createContext<StoreApi<DialogStore> | null>(
    null,
);

export interface DialogStoreProviderProps {
    children: ReactNode;
}

export const DialogStoreProvider = ({ children }: DialogStoreProviderProps) => {
    const storeRef = useRef<StoreApi<DialogStore>>();
    if (!storeRef.current) {
        storeRef.current = createDialogStore();
    }
    return (
        <DialogStoreContext.Provider value={storeRef.current}>
            {children}
        </DialogStoreContext.Provider>
    );
};

export const useDialogStore = <T,>(selector: (store: DialogStore) => T): T => {
    const dialogStoreContext = useContext(DialogStoreContext);

    if (!dialogStoreContext) {
        throw new Error(
            'useDialogStore must be used within DialogStoreProvider',
        );
    }

    return useStore(dialogStoreContext, selector);
};
