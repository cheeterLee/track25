'use server';

import Stripe from 'stripe';
import { validateRequest } from './auth';
import { db } from '@/db';
import { getPremiumType } from './helper';
import { subscription, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2023-10-16',
});

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;

export async function createStripeCheckoutSession(lineItems: LineItem[]) {
    const { user: authUser } = await validateRequest();
    if (!authUser) {
        return { sessionId: null, error: 'no user' };
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: lineItems,
        success_url: `${BASE_URL}/payment?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/main`,
    });

    return { sessionId: session.id, error: null };
}

export async function retrieveCheckoutSession(sessionId: string) {
    const { user: authUser } = await validateRequest();
    if (!authUser) {
        return { success: false, error: 'no user' };
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
    });

    // abort if payment is not success
    if (session.payment_status !== 'paid') {
        return { success: false, error: 'unpaid' };
    }

    const sub = session.subscription;
    if (typeof sub == 'string' || sub == null) {
        return { success: false, error: 'no session' };
    }

    const { id: subId } = sub;

    // @ts-ignore type inferring bug in Stripe
    const plan: Stripe.Plan = sub.plan;
    const type = getPremiumType(plan);
    const userId = authUser.id;

    await db.insert(subscription).values({
        id: subId,
        userId: userId,
        type: type,
    });

    await db
        .update(user)
        .set({
            isPremium: true,
            tariff: type,
            subscriptionId: subId,
        })
        .where(eq(user.id, authUser.id));

    return { success: true, error: null, sub: sub };
}

// cancel subscription

// retrieve to check and update subscription
