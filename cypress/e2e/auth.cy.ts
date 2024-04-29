describe('auth', () => {
    it('should be redirected to main page when successfully logged in', {defaultCommandTimeout: 10000}, () => {
        cy.visit('/');
        cy.get('button')
            .contains('Login/Signup')
            .should('be.visible')
            .click({ force: true });
        cy.get('input[name="username"]').type('test');
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]')
            .contains(/^Login$/)
            .click();
        cy.url().should('match', /\/main$/);
    });

    it('should display error message when trying to login with empty info', () => {
        cy.visit('/');
        cy.get('button')
            .contains('Login/Signup')
            .should('be.visible')
            .click({ force: true });
        cy.get('button[type=submit]')
            .contains(/^Login$/)
            .click();
        cy.get('p')
            .contains(/^Username contains at least 2 chars$/)
            .should('exist');
        cy.get('p')
            .contains(/^Password contains at least 6 chars$/)
            .should('exist');
    });

    it('should display error message when trying to register with empty info', () => {
        cy.visit('/');
        cy.get('button')
            .contains('Login/Signup')
            .should('be.visible')
            .click({ force: true });
        cy.get('button[role="tab"]')
            .contains(/^Signup$/)
            .click();
        cy.get('button[type=submit]')
            .contains(/^Sign up$/)
            .click();
        cy.get('p')
            .contains(/^Username contains at least 2 chars$/)
            .should('exist');
        cy.get('p')
            .contains(/^Password contains at least 6 chars$/)
            .should('exist');
    });
});
