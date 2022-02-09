import "@percy/cypress";

describe("Serviços", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de serviços", () => {
    cy.visit("/servicos");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Realiza corretamente o cadastro do serviço", () => {
    cy.contains("Novo serviço")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/servicos/form");
      });

    cy.get(`[data-cy="servico"]`).should("be.visible");

    cy.get("form").submit();
    cy.should("contain", "Nome obrigatório");
    cy.get(`[data-cy="insumos"]`).should("be.disabled");

    cy.get(`#nome`).should("be.visible").type("Teste serviço cypress");
    cy.focused().should("have.attr", "name").and("eq", "nome");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.get(`[data-cy="insumos"]`).should("not.be.disabled");
    cy.get(`#valor`).should("be.visible").type("4.99").focus().blur();
    cy.get(`#custo`).should("be.visible").type("2.00").focus().blur();
    cy.get(`#margemLucro`).should("be.visible");

    cy.get(`[data-cy="insumos"]`).should("be.visible").click();

    cy.get(`#produto`)
      .should("be.visible")
      .type("Couve")
      .then(() => {
        cy.contains("Couve");
        cy.wait(2000);
        cy.get(`#produto`).type("Couve{enter}");
      });

    cy.get(`#quantidade`).should("be.visible").type("10");
    cy.get(`[data-cy="adicionar"]`).should("be.visible").click();

    cy.get("#table-insumos")
      .should("be.visible")
      .should("be.visible")
      .contains("td", "Couve");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
    cy.wait(3000);
  });

  it("Realizando edição de insumos do serviço", () => {
    cy.get(`#pesquisa`).should("be.visible").type("serviço cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste serviço cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Editar serviço"]`).should("be.visible").click();

    cy.get(`[data-cy="insumos"]`).should("be.visible").click();

    cy.get("#table-insumos")
      .should("be.visible")
      .should("be.visible")
      .contains("td", "Couve");

    cy.get(`[aria-label="Editar produto"]`).should("be.visible").click();

    cy.get(`#quantidade`).should("be.visible").clear();
    cy.get(`#quantidade`).should("be.visible").type("15");
    cy.get(`[data-cy="adicionar"]`).should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Insumo atualizado com sucesso!");

    cy.get(`[data-cy="voltar"]`).should("be.visible").click();
  });

  it("Realiza a edição do serviço", () => {
    cy.visit("/servicos");
    cy.get(`#pesquisa`).should("be.visible").type("serviço cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste serviço cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Editar serviço"]`).should("be.visible").click();

    cy.wait(3000);
    cy.get(`#valor`).clear();

    cy.get(`#valor`).should("be.visible").type("4.80").focus().blur();

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
    cy.get(`#pesquisa`).clear();
  });

  it("Realiza a exclusão do produto", () => {
    cy.visit("/servicos");
    cy.get(`#pesquisa`).should("be.visible").type("serviço cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste serviço cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Excluir serviço"]`).should("be.visible").click();
    cy.get('[data-test-id="remover"]').should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Serviço removido com sucesso");
  });
});
