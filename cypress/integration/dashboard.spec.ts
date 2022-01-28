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
});
