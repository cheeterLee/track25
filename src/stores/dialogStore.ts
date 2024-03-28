import { createStore } from 'zustand/vanilla';

export type DialogState = {
    fileUploadDialogOpen: boolean;
};

export type DialogActions = {
    setFileUploadDialogOpen: () => void;
};

export type DialogStore = DialogActions & DialogState;

export const defaultInitState: DialogState = {
    fileUploadDialogOpen: false,
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
    }));
};
