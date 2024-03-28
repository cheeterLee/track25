'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, startTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSlug, isGpxFile } from '@/lib/helper';
import { TrackReqParam } from '@/lib/type';
import { useRouter } from 'next/navigation';
import { useTrackStore } from '@/providers/TrackStoreProvider';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function UploadForm() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [fileStr, setFileStr] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const router = useRouter();

    let fileReader = useRef<FileReader | null>(null);

    const handleFileRead = () => {
        if (fileReader.current) {
            const content = fileReader.current.result;
            setFileStr(content as string);
        }
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files == null) {
            return;
        }
        const file = event.target.files[0];
        fileReader.current = new FileReader();
        fileReader.current.onloadend = handleFileRead;
        fileReader.current.readAsText(file);
    };

    const { setJustUploadedTrue } = useTrackStore((state) => state);

    return (
        <>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    if (!inputFileRef.current?.files) {
                        throw new Error('No file selected');
                    }

                    setIsUploading(true);

                    const file = inputFileRef.current.files[0];

                    const isFileValid = isGpxFile(file.name);
                    if (!isFileValid) {
                        toast({
                            variant: 'destructive',
                            title: 'Invalid File Type',
                            description: 'Only support gpx files.',
                            duration: 2000,
                        });
                        return;
                    }

                    const response = await fetch(
                        `/api/file/upload?filename=${file.name}`,
                        {
                            method: 'POST',
                            body: file,
                        },
                    );

                    const newBlob = (await response.json()) as PutBlobResult;

                    const slug = getSlug(newBlob.pathname);

                    const params: TrackReqParam = {
                        slug: slug,
                        fileString: fileStr,
                        downloadUrl: newBlob.url,
                    };

                    const res = await fetch('/api/track/add', {
                        method: 'POST',
                        body: JSON.stringify(params),
                    });

                    const data: { code: number } = await res.json();
                    if (data.code === 200) {
                        toast({
                            title: 'Successfully uploaded!',
                            duration: 2000,
                        });

                        startTransition(() => {
                            router.refresh();
                        });

                        setJustUploadedTrue();
                    } else {
                        toast({
                            variant: 'destructive',
                            title: 'Something went wrong',
                            duration: 2000,
                        });
                    }
                    setIsUploading(false);
                }}
                className='flex flex-col gap-3'
            >
                <Input
                    onChange={(e) => handleOnChange(e)}
                    name='file'
                    type='file'
                    ref={inputFileRef}
                    required
                />
                <div className='flex w-full justify-end'>
                    <Button
                        disabled={isUploading}
                        variant='secondary'
                        type='submit'
                    >
                        {isUploading && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        Upload
                    </Button>
                </div>
            </form>
        </>
    );
}
