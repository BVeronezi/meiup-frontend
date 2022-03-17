import "@percy/cypress";

describe("Promoção Serviços", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de promoções", () => {
    cy.visit("/promocoes");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Realiza corretamente o cadastro do promoção serviços", () => {
    cy.contains("Nova promoção")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/promocoes/form");
      });

    cy.get(`[data-cy="promocao"]`).should("be.visible");

    cy.get("form").submit();
    cy.should("contain", "Descrição obrigatória");
    cy.get(`[data-cy="produtos"]`).should("be.disabled");
    cy.get(`[data-cy="servicos"]`).should("be.disabled");

    cy.get(`#descricao`).should("be.visible").type("Teste promoção cypress");
    cy.focused().should("have.attr", "name").and("eq", "descricao");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.get(`[data-cy="produtos"]`).should("not.be.disabled");
    cy.get(`[data-cy="servicos"]`).should("not.be.disabled");

    cy.wait(3000);

    cy.get(`[data-cy="servicos"]`).should("be.visible").click();

    cy.get(`#servico`)
      .should("be.visible")
      .type("Detox verde")
      .then(() => {
        cy.contains("Detox verde");
        cy.wait(2000);
        cy.get(`#servico`).type("Detox verde{enter}");
      });

    cy.get(`#precoPromocional`).should("be.visible").type("10.00");
    cy.wait(2000);

    cy.get('[data-cy="adicionar-servico"]').should("be.visible");
    cy.get('[data-cy="adicionar-servico"]').click();

    cy.get("#table-servicos-promocao")
      .should("be.visible")
      .should("be.visible")
      .contains("td", "Detox verde");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click().first();
    cy.wait(3000);
  });

  it("Realiza a exclusão da promoção", () => {
    cy.visit("/promocoes");
    cy.get(`#pesquisa`).should("be.visible").type("Teste promoção cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste promoção cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Excluir promoção"]`).should("be.visible").click();
    cy.get('[data-test-id="remover"]').should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Promoção removida com sucesso");
  });
});
