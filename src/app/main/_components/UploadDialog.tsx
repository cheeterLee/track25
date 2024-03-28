'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import UploadForm from './UploadForm';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useDialogStore } from '@/providers/DialogStoreProvider';

export default function UploadDialog() {
    const { fileUploadDialogOpen, setFileUploadDialogOpen } = useDialogStore(
        (state) => state,
    );

    return (
        <Dialog
            open={fileUploadDialogOpen}
            onOpenChange={setFileUploadDialogOpen}
        >
            <DialogTrigger asChild>
                <Button variant='outline' className='flex items-center gap-1'>
                    <Upload width={15} height={15} />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload your gpx file</DialogTitle>
                </DialogHeader>
                <UploadForm />
            </DialogContent>
        </Dialog>
    );
}
