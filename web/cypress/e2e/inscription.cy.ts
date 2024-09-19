describe('[LAYOUT] Inscription page', () => {
	beforeEach('Go to inscription page', () => {
		cy.visit('/inscription');
	});

	it('Title', () => {
		cy.get('#app-title').should('contain', 'Anthologia');
	});

	it('Description', () => {
		cy.get('#app-description').should('contain', 'Le journal décentralisé luttant contre la censure.');
	});

	it('Email input', () => {
		cy.get('#inscription-email-input').should('be.visible');
	});

	it('Username input', () => {
		cy.get('#inscription-username-input').should('be.visible');
	});

	it('Password input', () => {
		cy.get('#inscription-pwd-input').should('be.visible');
	});

	it('Confirmed password input', () => {
		cy.get('#inscription-confirmed-pwd-input').should('be.visible');
	});

	it('Inscription button', () => {
		cy.get('#inscription-inscription-btn').should('contain', 'Inscription');
	});

	it('Connexion button', () => {
		cy.get('#inscription-connexion-btn').should('contain', 'Connexion');
	});
});

describe('[LINKS] Inscription page', () => {
	beforeEach('Go to inscription page', () => {
		cy.visit('/inscription');
	});

	it('Link to inscription page', () => {
		cy.get('#inscription-connexion-btn').click().url().should('eq', `${Cypress.config().baseUrl}/connexion`);
	});
});
