'use client';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function LogoWrapper({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    const { theme } = useTheme();

    return (
        <div className='justify-center z-[-100] flex max-h-full max-w-full items-center'>
            <Image
                src={theme === 'dark' ? '/logo_dark.png' : '/logo_light.png'}
                width={width}
                height={height}
                alt='logo'
            />
        </div>
    );
}
