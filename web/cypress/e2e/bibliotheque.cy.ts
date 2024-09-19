describe('[LAYOUT] Bibliotheque page', () => {
	beforeEach('Go to bibliotheque page', () => {
		cy.visit('/bibliotheque');
	});

	it('Redirection', () => {
		cy.get('#app-title').should('contain', 'Anthologia');
	});
});
