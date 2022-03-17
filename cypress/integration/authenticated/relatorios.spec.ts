import "@percy/cypress";

describe("Relatórios", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de relatorios", () => {
    cy.visit("/relatorios");
    // Take a agenda for visual diffing
    cy.percySnapshot();
  });
});
