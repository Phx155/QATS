describe('Technical task 1', () => {
  const articleTitle = 'Test-46';
  const articleDesc = 'description';
  const articleBody = 'article';
  const articleTags = 'stach';
  const loginEmail = 'tech_task@qats.sk';
  const loginPassword = '124lkjAF89as';
  const host = 'https://react-redux.realworld.io/';
  beforeEach(() => {
    cy.intercept('GET', 'https://api.realworld.io/api/articles?limit=10&offset=0').as('getArticles');
    cy.intercept('DELETE', /api.realworld.io\/api\/articles\/.*/).as('delArticle');
    cy.log('Login');
    cy.visit(host);
    cy.get("[href='#login']").click();
    cy.get("[type='email']").type(loginEmail);
    cy.get("[type='password']").type(loginPassword);
    cy.get("[type='submit']").click();
    cy.get("[href='#login']").should('not.exist');
    cy.get("[href='#@Technical Task']");
    cy.wait('@getArticles');
  });
  afterEach(() => {
    cy.log('Logout');
    cy.get("[href='#settings']").click();
    cy.get('.btn-outline-danger').click();
    cy.get("[href='#login']");
  });
  describe('Test Case 1', () => {
    it('should create post', () => {
      cy.get("[href='#editor']").click();
      cy.get("[type='button']").click();
      cy.get('.error-messages');
      cy.get("[placeholder='Article Title']").type(articleTitle);
      cy.get(`[placeholder="What's this article about?"]`).type(articleDesc);
      cy.get("[placeholder='Write your article (in markdown)']").type(articleBody);
      cy.get("[placeholder='Enter tags']").type(articleTags);
      cy.get("[type='button']").click();
      cy.get('.error-messages').should('not.exist');
      cy.url().should('include', `article/${articleTitle}`);
      cy.get('.article-page');
      cy.get('.container').contains(articleTitle);
      cy.get('.article-content').contains(articleBody);
    });
  });
  describe('Test Case 2', () => {
    it('should delete post', () => {
      cy.get('.nav-link').contains('Global Feed').click();
      cy.get('.nav-link').contains('Global Feed').should('have.class', 'active');
      cy.wait('@getArticles');
      cy.get(`[href*=${articleTitle}]`).click();
      cy.get('.btn-outline-danger').click();
      cy.wait('@delArticle');
      cy.get('.nav-link').contains('Global Feed').click();
      cy.get('.nav-link').contains('Global Feed').should('have.class', 'active');
      cy.get('.article-preview').should('not.contain', articleTitle);
    });
  });
});
