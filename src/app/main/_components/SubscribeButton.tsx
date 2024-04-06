'use client';

import { Button } from '@/components/ui/button';
import { createStripeCheckoutSession } from '@/actions/paymentActions';
import { Plan } from '@/lib/type';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
);

export default function SubscribeButton({ plan }: { plan: Plan }) {
    const handleSubscribe = async (priceId: string) => {
        try {
            const lineItems = [
                {
                    price: priceId,
                    quantity: 1,
                },
            ];
            const { sessionId, error: checkoutError } =
                await createStripeCheckoutSession(lineItems);
            if (!sessionId || checkoutError) {
                throw new Error(
                    checkoutError || 'Failed to create checkout session!',
                );
            }
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Failed to load Stripe!');
            }
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
                if (error instanceof Error) throw new Error(error.message);
            } else {
                throw error;
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <Button
            variant='outline'
            className='mt-10'
            onClick={() => handleSubscribe(plan.id)}
        >
            Subscribe
        </Button>
    );
}
