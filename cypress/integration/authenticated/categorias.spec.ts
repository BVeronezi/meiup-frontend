
describe("Categoria", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de categoria", () => {
    cy.visit("/categorias");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Abrir formulário ao clicar em nova categoria", () => {
    cy.contains("Nova categoria")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/categorias/form");
      });

    cy.get('[data-cy="voltar"]').click();
  });

  it("Tenta realizar o cadastro sem informar o nome, sistema deve apresentar mensagem de erro", () => {
    cy.contains("Nova categoria")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/categorias/form");
      });

    cy.get("form").submit();
    cy.should("contain", "Nome obrigatório");
  });

  it("Realiza corretamente o cadastro da categoria", () => {
    cy.get(`[data-cy="categoria"]`).should("be.visible");

    cy.get(`#nome`).should("be.visible").type("Teste categoria cypress");
    cy.focused().should("have.attr", "name").and("eq", "nome");
    
    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
  });

  it("Realizar pesquisa da categoria pelo nome", () => {
    cy.visit("/categorias");
    cy.get(`#pesquisa`).should("be.visible").type("categoria cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste categoria cypress");
    cy.get(`#pesquisa`).clear();
  });

  it("Realiza a edição da categoria", () => {
    cy.visit("/categorias");
    cy.get(`#pesquisa`).should("be.visible").type("categoria cypress");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste categoria cypress");
    cy.wait(2000);
    cy.get(`[aria-label="Editar categoria"]`).should("be.visible").click();

    cy.wait(3000);
    cy.get(`#nome`).clear();

    cy.get(`#nome`)
      .should("be.visible")
      .type("Teste categoria cypress 2")
      .focus()
      .blur();

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
    cy.get(`#pesquisa`).clear();
  });

  it("Realiza a exclusão da categoria", () => {
    cy.visit("/categorias");
    cy.get(`#pesquisa`).should("be.visible").type("categoria cypress 2");
    cy.get("table")
      .should("be.visible")
      .contains("td", "Teste categoria cypress 2");
    cy.wait(3000);
    cy.get(`[aria-label="Excluir categoria"]`).should("be.visible").click();
    cy.get('[data-test-id="remover"]').should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Categoria removida com sucesso");
  });

});
