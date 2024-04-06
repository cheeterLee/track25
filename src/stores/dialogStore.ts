import { createStore } from 'zustand/vanilla';

export type DialogState = {
    fileUploadDialogOpen: boolean;
    authModalOpen: boolean;
};

export type DialogActions = {
    setFileUploadDialogOpen: () => void;
    setAuthModalOpen: () => void;
};

export type DialogStore = DialogActions & DialogState;

export const defaultInitState: DialogState = {
    fileUploadDialogOpen: false,
    authModalOpen: false,
};

export const createDialogStore = (
    initState: DialogState = defaultInitState,
) => {
    return createStore<DialogStore>()((set) => ({
        ...initState,
        setFileUploadDialogOpen: () =>
            set((state) => ({
                ...state,
                fileUploadDialogOpen: !state.fileUploadDialogOpen,
            })),
        setAuthModalOpen: () =>
            set((state) => ({
                ...state,
                authModalOpen: !state.authModalOpen,
            })),
    }));
};
