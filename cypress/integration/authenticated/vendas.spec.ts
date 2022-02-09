import "@percy/cypress";

describe("Vendas", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de vendas", () => {
    cy.visit("/vendas");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Realizar pesquisa da venda pelo nome do cliente", () => {
    cy.get(`#pesquisa`).should("be.visible").type("Dione");
    cy.get("table").should("be.visible").contains("td", "Dione");
    cy.get(`#pesquisa`).clear();
  });
});
