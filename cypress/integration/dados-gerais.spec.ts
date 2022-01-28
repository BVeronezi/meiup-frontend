import "@percy/cypress";

describe("Dashboard", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get('input[name="email"]').type("teste@gmail.com");
    cy.get('input[name="senha"]').type("123456");
    cy.contains("Entrar")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/dashboard");
      });
  });

  it("Carregar a página de dashboard", () => {
    cy.visit("/dados-gerais");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });
});
