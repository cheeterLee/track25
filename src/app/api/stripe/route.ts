import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2023-10-16',
});

const endpointSecret = process.env.WEBHOOK_SECRET ?? '';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request): Promise<NextResponse> {
    const sig = headers().get('stripe-signature') ?? '';
    const payload = Buffer.from(await req.arrayBuffer());
    let event: Stripe.Event;

    try {
        event = await stripe.webhooks.constructEventAsync(
            payload,
            sig,
            endpointSecret,
        );
    } catch (err) {
        return NextResponse.json({ error: err });
    }

    if (event.type === 'checkout.session.completed') {
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            (event.data.object as any).id,
            {
                expand: ['line_items'],
            },
        );
        const lineItems = sessionWithLineItems.line_items;

        if (!lineItems) {
            return NextResponse.json({ error: 'no line items' });
        }

        // =============================
        console.log('data', lineItems.data);
    }

    return NextResponse.json({ code: 200 });
}
