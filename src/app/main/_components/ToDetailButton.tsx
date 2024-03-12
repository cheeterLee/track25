'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ToDetailButton({ slug }: { slug: string }) {
    const router = useRouter();

    const handleClick = () => router.push(`/main/${slug}`);

    return (
        <Button size='icon' variant='ghost' onClick={handleClick}>
            <ChevronRight width={20} height={20} />
        </Button>
    );
}
