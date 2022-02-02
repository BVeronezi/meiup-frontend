import "@percy/cypress";

describe("Produtos", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de produto", () => {
    cy.visit("/produtos");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Abrir formulário ao clicar em novo produto", () => {
    cy.contains("Novo produto")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/produtos/form");
      });

    cy.get('[data-cy="voltar"]').click();
  });

  it("Tenta realizar o cadastro sem informar a descrição, sistema deve apresentar mensagem de erro", () => {
    cy.contains("Novo produto")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/produtos/form");
      });

    cy.get("form").submit();
    cy.should("contain", "Descrição obrigatória");
  });

  it("Realiza corretamente o cadastro do produto", () => {
    cy.get(`[data-cy="produto"]`).should("be.visible");

    cy.get(`#descricao`).should("be.visible").type("Teste produto cypress");
    cy.focused().should("have.attr", "name").and("eq", "descricao");
    cy.get(`#tipoItem`).should("be.visible").type("Produto{enter}");
    cy.get(`#unidade`).should("be.visible").type("Caixa{enter}");
    cy.get(`#categoria`)
      .should("be.visible")
      .type("Tools")
      .then(() => {
        cy.contains("Tools");
        cy.get(`#categoria`).type("Tools{enter}");
      });

    cy.get(`[data-cy="estoque"]`).should("be.visible").click();
    cy.get(`#estoque`).should("be.visible").type("20");
    cy.get(`#estoqueMinimo`).should("be.visible").type("14");
    cy.get(`#estoqueMaximo`).should("be.visible").type("40");

    cy.get(`[data-cy="precos"]`).should("be.visible").click();
    cy.get(`#precoVendaVarejo`)
      .should("be.visible")
      .type("4.99")
      .focus()
      .blur();
    cy.get(`#precoVendaAtacado`)
      .should("be.visible")
      .type("4.00")
      .focus()
      .blur();
    cy.get(`#precoCompra`).should("be.visible").type("2.50").focus().blur();
    cy.get(`#margemLucro`).should("be.visible");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
  });

  it("Realizar pesquisa do produto pela descrição", () => {
    cy.visit("/produtos");
    cy.get(`#pesquisa`).should("be.visible").type("Teste produto cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste produto cypress");
    cy.get(`#pesquisa`).clear();
  });

  it("Realiza a edição do produto", () => {
    cy.visit("/produtos");
    cy.get(`#pesquisa`).should("be.visible").type("produto cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste produto cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Editar produto"]`)
      .should("be.visible")
      .first()
      .click();

    cy.get(`[data-cy="precos"]`).should("be.visible").click();

    cy.get(`#precoVendaVarejo`).clear();

    cy.get(`#precoVendaVarejo`)
      .should("be.visible")
      .type("4.80")
      .focus()
      .blur();

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.wait(3000);

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Dados salvos com sucesso");

    cy.url().should("be.equal", `${Cypress.env("urlFront")}/produtos`);
    cy.get(`#pesquisa`).clear();
  });

  it("Realiza a exclusão do produto", () => {
    cy.visit("/produtos");
    cy.get(`#pesquisa`).should("be.visible").type("produto cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste produto cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Excluir produto"]`)
      .should("be.visible")
      .first()
      .click();
    cy.get('[data-test-id="remover"]').should("be.visible").first().click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Produto removido com sucesso");
  });
});
