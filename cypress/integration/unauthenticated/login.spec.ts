import "@percy/cypress";

describe("Página de login", () => {
  it("Carregar a página de login", () => {
    cy.visit("/login");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Deve conter a opção de cadastrar", () => {
    cy.get('a[href*="/sign-up"]').should("be.visible");
  });

  it("Deve conter a opção de cadastrar", () => {
    cy.get('a[href*="/sign-up"]').should("be.visible");
  });

  it("Deve conter a opção de lembrar dados de login", () => {
    cy.get('[type="checkbox"]').should("be.visible");
  });

  it("Deve conter o formulário para logar no sistema", () => {
    cy.get("form").should("be.visible");
  });

  it("Deve apresentar mensagem de erro caso não preencha os campos obrigaatórios", () => {
    cy.get("form").submit();
    cy.should("contain", "E-mail obrigatório");
    cy.should("contain", "Senha obrigatória");
  });

  it("Deve conter os campos de email e senha para login", () => {
    cy.get('input[name="email"]').get('input[name="senha"]');
  });

  it("Deve conter o botão de entrar e permitir logar no sistema", () => {
    cy.get('input[name="email"]').type("teste@gmail.com");
    cy.get('input[name="senha"]').type("123456");
    cy.contains("Entrar")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/dashboard");
      });
  });
});
