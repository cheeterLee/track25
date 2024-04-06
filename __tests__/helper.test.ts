import { getSlug, isGpxFile, getPremiumType } from '@/lib/helper';
import Stripe from 'stripe';

test('should get the slug of a gpx file', () => {
    expect(getSlug('Newhaven_Brighton.gpx')).toBe('Newhaven_Brighton');
    expect(getSlug('Serqueaux_Dieppe.gpx')).toBe('Serqueaux_Dieppe');
    expect(getSlug('Southampton_Portsmouth.gpx')).toBe(
        'Southampton_Portsmouth',
    );
});

test('should verify if the file is a gpx file', () => {
    expect(isGpxFile('Newhaven_Brighton.gpx')).toBeTruthy();
    expect(isGpxFile('Newhaven_Brighton.jpg')).toBeFalsy();
    expect(isGpxFile('Newhaven_Brighton')).toBeFalsy();
});

test('should get the correct plan type', () => {
    expect(
        getPremiumType({ interval: 'month', interval_count: 1 } as Stripe.Plan),
    ).toBe('monthly');
    expect(
        getPremiumType({ interval: 'month', interval_count: 3 } as Stripe.Plan),
    ).toBe('quarterly');
    expect(
        getPremiumType({ interval: 'year', interval_count: 1 } as Stripe.Plan),
    ).toBe('yearly');
    expect(
        getPremiumType({ interval: 'day', interval_count: 2 } as Stripe.Plan),
    ).toBe('free');
});
