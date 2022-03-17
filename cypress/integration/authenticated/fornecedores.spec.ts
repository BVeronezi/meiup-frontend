describe("Fornecedores", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de fornecedores", () => {
    cy.visit("/fornecedores");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Abrir formulário ao clicar em novo fornecedor", () => {
    cy.contains("Novo fornecedor")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/fornecedores/form");
      });

    cy.get('[data-cy="voltar"]').click();
  });

  it("Realiza o cadastro de fornecedor corretamente", () => {
    cy.visit("/fornecedores/form");
    cy.get(`[data-cy="dados-basicos"]`).should("be.visible");

    cy.get(`#nome`).should("be.visible").type("Teste fornecedor cypress");
    cy.focused().should("have.attr", "name").and("eq", "nome");

    cy.get(`#email`).should("be.visible").type("testeCypress@gmail.com");
    cy.get(`#celular`).should("be.visible").type("31994411234");
    cy.get(`#telefone`).should("be.visible").type("3130161234");

    cy.endereco();
    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
  });

  it("Realiza a edição do fornecedor", () => {
    cy.visit("/fornecedores");

    cy.get(`#pesquisa`).should("be.visible").type("fornecedor cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste fornecedor cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Editar fornecedor"]`).should("be.visible").click();

    cy.wait(3000);

    cy.get(`#nome`).should("have.value", "Teste fornecedor cypress");
    cy.get(`#email`)
      .should("be.visible")
      .should("have.value", "testeCypress@gmail.com");

    cy.get(`#nome`).clear();
    cy.get(`#nome`).type("Teste fornecedor cypress 2");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Dados salvos com sucesso");

    cy.url().should("be.equal", `${Cypress.env("urlFront")}/fornecedores`);
  });

  it("Realiza a exclusão do fornecedor", () => {
    cy.visit("/fornecedores");

    cy.get(`#pesquisa`).should("be.visible").type("Teste fornecedor cypress 2");
    cy.get("table")
      .should("be.visible")
      .contains("td", "este fornecedor cypress 2");
    cy.wait(3000);
    cy.get(`[aria-label="Excluir fornecedor"]`).should("be.visible").click();
    cy.get('[data-test-id="remover"]').should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Fornecedor removido com sucesso");
  });
});
