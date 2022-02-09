describe("Clientes", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de clientes", () => {
    cy.visit("/clientes");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Abrir formulário ao clicar em novo cliente", () => {
    cy.contains("Novo cliente")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/clientes/form");
      });

    cy.get('[data-cy="voltar"]').click();
  });

  it("Realiza o cadastro de cliente corretamente", () => {
    cy.visit("/clientes/form");
    cy.get(`[data-cy="dados-basicos"]`).should("be.visible");

    cy.get(`#nome`).should("be.visible").type("Teste cliente cypress");
    cy.focused().should("have.attr", "name").and("eq", "nome");

    cy.get(`#email`).should("be.visible").type("testeCypress@gmail.com");
    cy.get(`#celular`).should("be.visible").type("31994411234");
    cy.get(`#telefone`).should("be.visible").type("3130161234");

    cy.endereco();
    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
  });

  it("Realiza a edição do cliente", () => {
    cy.visit("/clientes");

    cy.get(`#pesquisa`).should("be.visible").type("cliente cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste cliente cypress");
    cy.wait(3000);
    cy.get(`[aria-label="Editar cliente"]`).should("be.visible").click();

    cy.get(`#nome`).should("have.value", "Teste cliente cypress");
    cy.get(`#email`)
      .should("be.visible")
      .should("have.value", "testeCypress@gmail.com");

    cy.get(`#nome`).clear();
    cy.get(`#nome`).type("Teste cliente cypress 2");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Dados salvos com sucesso");

    cy.url().should("be.equal", `${Cypress.env("urlFront")}/clientes`);
  });

  it("Realiza a exclusão do cliente", () => {
    cy.visit("/clientes");

    cy.get(`#pesquisa`).should("be.visible").type("este cliente cypress 2");
    cy.get("table")
      .should("be.visible")
      .contains("td", "este cliente cypress 2");
    cy.wait(3000);
    cy.get(`[aria-label="Excluir cliente"]`).should("be.visible").click();
    cy.get('[data-test-id="remover"]').should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Cliente removido com sucesso");
  });
});
