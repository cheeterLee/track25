'use server';

import Stripe from 'stripe';
import { validateRequest } from '../lib/auth';
import { db } from '@/db';
import { getPremiumType } from '../lib/helper';
import { friendList, subscription, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { format } from 'date-fns';

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

    const { id: subId, current_period_start, current_period_end } = sub;
    // stripe unix timestamps needs be to multiply by 1000
    const periodStartTime = format(current_period_start * 1000, 'dd/MM/yyyy');
    const periodEndTime = format(current_period_end * 1000, 'dd/MM/yyyy');

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

    return {
        success: true,
        error: null,
        periodStartTime: periodStartTime,
        periodEndTime: periodEndTime,
        type: type,
    };
}

// cancel subscriptions
export async function cancelSubscription(userId: string) {
    const _user = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
    });
    if (_user === undefined) {
        return { success: false, error: 'no user' };
    }
    const subId = _user.subscriptionId;
    if (!subId) {
        return { success: false, error: 'no sub founded' };
    }
    const sub = await stripe.subscriptions.cancel(subId);
    if (sub) {
        await db
            .update(user)
            .set({
                isPremium: false,
                tariff: 'free',
            })
            .where(eq(user.id, userId));
        return { success: true, error: null };
    } else {
        return { success: false, error: 'cannot cancel' };
    }
}

// check if subscription is valid
export async function validateSubscription(userId: string) {
    const _user = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
    });
    if (_user === undefined) {
        return { isPremium: false, tariff: 'free', error: 'user is undefined' };
    }
    const subId = _user.subscriptionId;
    if (!subId) {
        return { isPremium: false, tariff: 'free', error: 'no sub founded' };
    }
    const sub = await stripe.subscriptions.retrieve(subId);
    if (sub.status !== 'active') {
        await db
            .update(user)
            .set({
                isPremium: false,
                tariff: 'free',
            })
            .where(eq(user.id, userId));
        return { isPremium: false, tariff: 'free', error: null };
    } else {
        return { isPremium: true, tariff: _user.tariff, error: null };
    }
}
