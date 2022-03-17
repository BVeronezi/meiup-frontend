import "@percy/cypress";

describe("Agenda", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de agenda", () => {
    cy.visit("/agenda");
    // Take a agenda for visual diffing
    cy.percySnapshot();
  });
});
