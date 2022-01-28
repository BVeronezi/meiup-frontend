import "@percy/cypress";

describe("Página de cadastro", () => {
  it("Carregar a página de cadastro", () => {
    cy.visit("/sign-up");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Deve conter a opção de entrar", () => {
    cy.get('a[href*="/login"]').should("be.visible");
  });

  it("Deve conter o formulário para cadastrar no sistema", () => {
    cy.get("form").should("be.visible");
  });

  it("Deve apresentar mensagem de erro caso não preencha os campos obrigaatórios", () => {
    cy.get("form").submit();
    cy.should("contain", "E-mail obrigatório");
    cy.should("contain", "Senha obrigatória");
  });

  it("Deve conter os campos de email e senha para para cadastro", () => {
    cy.get('input[name="email"]').get('input[name="senha"]');
  });

  it("Deve conter o botão de cadastrar e permitir cadastro no sistema", () => {
    cy.get('input[name="email"]').type("teste2@gmail.com");
    cy.get('input[name="senha"]').type("123456");
    cy.contains("Cadastrar");
  });
});
