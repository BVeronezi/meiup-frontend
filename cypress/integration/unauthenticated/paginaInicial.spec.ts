import "@percy/cypress";

describe("Página inicial", () => {
  it("Carregar a página inicial", () => {
    cy.visit("/");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Deve conter botão para logar no sistema e direcionar para a tela de login", () => {
    cy.contains("Comece já")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/login");
      });
  });
});
