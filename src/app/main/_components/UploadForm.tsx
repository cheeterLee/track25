'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, startTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSlug } from '@/lib/helper';
import { TrackReqParam } from '@/lib/type';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    const [fileStr, setFileStr] = useState<string>('');
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

    return (
        <>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    if (!inputFileRef.current?.files) {
                        throw new Error('No file selected');
                    }

                    const file = inputFileRef.current.files[0];
                    console.log(file);

                    const response = await fetch(
                        `/api/file/upload?filename=${file.name}`,
                        {
                            method: 'POST',
                            body: file,
                        },
                    );

                    const newBlob = (await response.json()) as PutBlobResult;
                    console.log('newBlob', newBlob);

                    setBlob(newBlob);

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
                    console.log('data client', data);
                    if (data.code === 200) {
                        startTransition(() => {
                            router.refresh();
                        });
                    }
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
                    <Button variant='secondary' type='submit'>
                        Upload
                    </Button>
                </div>
            </form>
            {blob && (
                <div>
                    Blob url: <a href={blob.url}>{blob.url}</a>
                </div>
            )}
        </>
    );
}
