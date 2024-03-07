'use client';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function LogoWrapper() {
    const { theme } = useTheme();

    return (
        <>
            <Image
                src={theme === 'dark' ? '/logo_dark.png' : '/logo_light.png'}
                width={200}
                height={100}
                alt='logo'
            />
        </>
    );
}
