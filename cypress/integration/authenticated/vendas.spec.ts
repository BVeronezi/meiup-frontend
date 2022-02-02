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
    cy.get(`#pesquisa`).should("be.visible").type("Sherri");
    cy.get("table").should("be.visible").contains("td", "Sherri Corpe");
    cy.get(`#pesquisa`).clear();
  });

  it("Realiza edição da venda", () => {
    cy.get(`#pesquisa`).should("be.visible").type("Sherri");
    cy.get("table").should("be.visible").contains("td", "Sherri Corpe");

    cy.wait(3000);
    cy.get(`[aria-label="Editar venda"]`).should("be.visible").click();
    cy.get('[data-cy="voltar"]').click();
  });
});
