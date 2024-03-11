'use client';

// import type { PutBlobResult } from "@vercel/blob"
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function UploadForm() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    // const [blob, setBlob] = useState<PutBlobResult | null>(null)

    const [fstr, setFstr] = useState<string>('');
    let fileReader = useRef<FileReader | null>(null);

    const handleFileRead = () => {
        if (fileReader.current) {
            const content = fileReader.current.result;
            setFstr(content as string);
        }
    };

    const handleOnChange = (event: any) => {
        const file = event.target.files[0];
        fileReader.current = new FileReader();
        fileReader.current.onloadend = handleFileRead;
        fileReader.current.readAsText(file);
    };

    return (
        <>
            <form
            // onSubmit={async (event) => {
            // 	event.preventDefault()

            // 	if (!inputFileRef.current?.files) {
            // 		throw new Error("No file selected")
            // 	}

            // 	const file = inputFileRef.current.files[0]
            // 	// console.log(file)

            // 	const response = await fetch(
            // 		`/api/file/upload?filename=${file.name}`,
            // 		{
            // 			method: "POST",
            // 			body: file,
            // 		}
            // 	)

            // 	const newBlob = (await response.json()) as PutBlobResult

            // 	setBlob(newBlob)

            // 	const params: any = {
            // 		slug: newBlob.pathname,
            // 		fileString: fstr,
            // 	}

            // 	const res = await fetch(`/api/track/add?filename=${file.name}`, {
            // 		method: "POST",
            // 		body: JSON.stringify(params),
            // 	})

            // 	const data: any = res.json()
            // }}

                className='flex flex-col gap-3'
            >
                <Input
                    onChange={(e) => handleOnChange(e)}
                    name='file'
                    type='file'
                    ref={inputFileRef}
                    required
                />
                {/* <input onChange={(e) => handleOnChange(e)} name="file" ref={inputFileRef} type="file" required /> */}
                {/* <button type='submit'>Upload</button> */}
                <div className='w-full flex justify-end'>
                    <Button variant='secondary' type='submit'>Upload</Button>
                </div>
            </form>
            {/* {blob && (
				<div>
					Blob url: <a href={blob.url}>{blob.url}</a>
				</div>
			)} */}
        </>
    );
}
