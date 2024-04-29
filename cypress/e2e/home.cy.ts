describe('home page navigation', () => {
    it('should navigate be redirect to home page', () => {
        cy.visit('/');
        cy.url().should('match', /\/home$/);
    });

    it('should navigate to about page', () => {
        cy.visit('/home');
        cy.get('a').contains('About').click();
        cy.url().should('match', /\/about$/);
    });

    it('should navigate to pricing page', () => {
        cy.visit('/');
        cy.get('a').contains('Pricing').click();
        cy.url().should('match', /\/pricing$/);
    });

    it('should navigate to showcase page', () => {
        cy.visit('/');
        cy.get('a').contains('Showcase').click();
        cy.url().should('match', /\/showcase$/);
    });

    it('should navigate to home page', () => {
        cy.visit('/');
        cy.get('a').contains('Home').click();
        cy.url().should('match', /\/home$/);
    });
});
