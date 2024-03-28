import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import colors from 'tailwindcss/colors';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateRandomColor() {
    const someNiceTailwindColors = [
        colors.red[500],
        colors.yellow[500],
        colors.cyan[500],
        colors.indigo[500],
        colors.fuchsia[500],
        colors.pink[500],
        colors.teal[500],
        colors.emerald[500],
        colors.orange[500],
        colors.stone[500],
        colors.slate[500],
    ];
    return someNiceTailwindColors[
        Math.floor(Math.random() * someNiceTailwindColors.length)
    ];
}
