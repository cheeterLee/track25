import Hero from './_components/hero';
import { Suspense } from 'react';

export default function PaymentScreen() {
    return (
        <Suspense>
            <Hero />;
        </Suspense>
    );
}
