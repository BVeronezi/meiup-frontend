import "@percy/cypress";

describe("Usuários", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de usuarios", () => {
    cy.visit("/usuarios");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Abrir formulário ao clicar em novo usuário", () => {
    cy.contains("Novo usuário")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/usuarios/form");
      });

    cy.get('[data-cy="voltar"]').click();
  });

  it("Realiza o cadastro de usuário corretamente", () => {
    cy.visit("/usuarios/form");
    cy.get(`[data-cy="dados-basicos"]`).should("be.visible");

    cy.get(`#nome`).should("be.visible").type("Teste cypress");
    cy.focused().should("have.attr", "name").and("eq", "nome");

    cy.get(`#email`).should("be.visible").type("testeCypress@gmail.com");
    cy.get(`#celular`).should("be.visible").type("31994411234");
    cy.get(`#telefone`).should("be.visible").type("3130161234");
    cy.get(`[data-cy="perfil"]`).should("be.visible").select("ADMIN");
    cy.get(`[data-cy="perfil"]`).should("be.visible").select("USER");
    cy.get('[data-cy="exibirSenha"]').should("be.visible").click();
    cy.get('[data-cy="exibirSenha"]').should("be.visible").click();

    cy.get(`[data-cy="endereco"]`).should("be.visible").click();
    cy.get(`#cep`).should("be.visible").type("31330670");
    cy.get(`#endereco`).should("be.visible");
    cy.get(`#numero`).should("be.visible").type("12345");
    cy.get(`#bairro`).should("be.visible");
    cy.get(`#cidade`).should("be.visible");
    cy.get(`#estado`).should("be.visible");
    cy.get(`#complemento`).should("be.visible").type("Apto 123");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
  });

  it("Realiza cadadstro de usuário com o mesmo e-mail, deve apresentar mensagem de erro", () => {
    cy.visit("/usuarios/form");
    cy.get(`[data-cy="dados-basicos"]`).should("be.visible");

    cy.get(`#nome`).should("be.visible").type("Teste cypress");
    cy.focused().should("have.attr", "name").and("eq", "nome");
    cy.get(`#email`).should("be.visible").type("testeCypress@gmail.com");
    cy.get(`#celular`).should("be.visible").type("31994411234");
    cy.get(`#telefone`).should("be.visible").type("3130161234");
    cy.get(`[data-cy="perfil"]`).should("be.visible").select("ADMIN");
    cy.get(`[data-cy="perfil"]`).should("be.visible").select("USER");
    cy.get('[data-cy="exibirSenha"]').should("be.visible").click();
    cy.get('[data-cy="exibirSenha"]').should("be.visible").click();

    cy.endereco();

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Endereço de email já está em uso");

    cy.url().should("be.equal", `${Cypress.env("urlFront")}/usuarios/form`);
  });

  it("Realiza a edição o usuário", () => {
    cy.visit("/usuarios");

    cy.get('[data-cy="nome-usuario"]')
      .should("be.visible")
      .contains("Teste cypress")
      .get(`[aria-label="Editar usuário"]`)
      .click();

    cy.get(`#nome`).should("have.value", "Teste cypress");
    cy.get(`#email`)
      .should("be.visible")
      .should("have.value", "testeCypress@gmail.com");

    cy.get(`#senha`).should("not.exist");

    cy.get(`#nome`).clear();
    cy.get(`#nome`).type("Teste cypress 2");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Dados salvos com sucesso");

    cy.url().should("be.equal", `${Cypress.env("urlFront")}/usuarios`);
  });

  it("Realiza a exclusão do usuário", () => {
    cy.visit("/usuarios");

    cy.get('[data-cy="nome-usuario"]')
      .should("be.visible")
      .contains("Teste cypress 2")
      .get(`[aria-label="Excluir usuário"]`)
      .click();
    cy.get('[data-test-id="cancelar"]').should("be.visible").click();

    cy.get('[data-cy="nome-usuario"]')
      .should("be.visible")
      .contains("Teste cypress 2")
      .get(`[aria-label="Excluir usuário"]`)
      .click();
    cy.get('[data-test-id="remover"]').should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Usuário removido com sucesso");
  });
});
