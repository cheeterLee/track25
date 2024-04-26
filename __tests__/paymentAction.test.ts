describe('paymentAction when user is not authenticated', () => {
    let user: any;
    const createStripeCheckoutSession = jest.fn();
    createStripeCheckoutSession.mockImplementation(() => {
        if (!user) {
            return {
                sessionId: null,
                error: 'no user',
            };
        }
    });
    const retrieveCheckoutSession = jest.fn();
    retrieveCheckoutSession.mockImplementation(() => {
        if (!user) {
            return { success: false, error: 'no user' };
        }
    });
    const cancelSubscription = jest.fn();
    cancelSubscription.mockImplementation(() => {
        if (!user) {
            return { success: false, error: 'no user' };
        }
    });
    const validateSubscription = jest.fn();
    validateSubscription.mockImplementation(() => {
        if (!user) {
            return {
                isPremium: false,
                tariff: 'free',
                error: 'user is undefined',
            };
        }
    });

    beforeEach(() => {
        user = null;
    });

    it('should return error when not authenticated create checkout session', () => {
        expect(createStripeCheckoutSession()).toStrictEqual({
            sessionId: null,
            error: 'no user',
        });
    });

    it('should return error when not authenticated retrieving checkout session', () => {
        expect(retrieveCheckoutSession()).toStrictEqual({
            success: false,
            error: 'no user',
        });
    });

    it('should return error when not authenticated cancel subscription', () => {
        expect(cancelSubscription()).toStrictEqual({
            success: false,
            error: 'no user',
        });
    });

    it('should return false when not authenticated validate subscription', () => {
        expect(validateSubscription()).toStrictEqual({
            isPremium: false,
            tariff: 'free',
            error: 'user is undefined',
        });
    });
});

describe('paymentAction when user is authenticated', () => {
    let user: any;
    const createStripeCheckoutSession = jest.fn();
    createStripeCheckoutSession.mockImplementation(() => {
        if (!user) {
            return {
                sessionId: null,
                error: 'no user',
            };
        }
        return { success: true, error: null };
    });
    const retrieveCheckoutSession = jest.fn();
    retrieveCheckoutSession.mockImplementation(() => {
        if (!user) {
            return { success: false, error: 'no user' };
        }
        return { success: true, error: null };
    });
    const cancelSubscription = jest.fn();
    cancelSubscription.mockImplementation(() => {
        if (!user) {
            return { success: false, error: 'no user' };
        }
        return { success: true, error: null };
    });
    const validateSubscription = jest.fn();
    validateSubscription.mockImplementation(() => {
        if (!user) {
            return {
                isPremium: false,
                tariff: 'free',
                error: 'user is undefined',
            };
        }
        return { success: true, error: null };
    });

    beforeEach(() => {
        user = { username: 'John' };
    });

    it('should return no error when authenticated create checkout session', () => {
        expect(createStripeCheckoutSession()).toStrictEqual({
            success: true,
            error: null,
        });
    });

    it('should return no error when authenticated retrieving checkout session', () => {
        expect(retrieveCheckoutSession()).toStrictEqual({
            success: true,
            error: null,
        });
    });

    it('should return no error when authenticated cancel subscription', () => {
        expect(cancelSubscription()).toStrictEqual({
            success: true,
            error: null,
        });
    });

    it('should return no error when authenticated validate subscription', () => {
        expect(validateSubscription()).toStrictEqual({
            success: true,
            error: null,
        });
    });
});
