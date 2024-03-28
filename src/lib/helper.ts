import Stripe from 'stripe';

export function getSlug(fileName: string): string {
    return fileName.split('.')[0];
}

export function getPremiumType(plan: Stripe.Plan) {
    if (plan.interval === 'month' && plan.interval_count === 1) {
        return 'monthly';
    } else if (plan.interval === 'month' && plan.interval_count === 3) {
        return 'quarterly';
    } else if (plan.interval === 'year') {
        return 'yearly';
    } else {
        return 'free';
    }
}

export function isGpxFile(fileName: string) {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return fileExtension === 'gpx';
}
