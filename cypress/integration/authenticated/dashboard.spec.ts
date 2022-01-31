import "@percy/cypress";

describe("Dashboard", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de dashboard", () => {
    cy.visit("/dashboard");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Realizar a navegação nos menus do sistema", () => {
    cy.get('a[href*="dados-gerais"]').click();
    cy.url().should("include", "/dados-gerais");

    cy.get('a[href*="usuarios"]').click();
    cy.url().should("include", "/usuarios");
  });
});
