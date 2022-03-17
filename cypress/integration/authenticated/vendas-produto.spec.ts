import "@percy/cypress";

describe("Vendas Produto", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Tenta realizar o cadastro sem informar o cliente, sistema deve apresentar mensagem de erro", () => {
    cy.visit("/vendas");
    cy.contains("Nova venda")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/vendas/form");
      });

    cy.get("form").submit();
    cy.should("contain", "Cliente obrigatório");

    cy.get(`[data-cy="produtos"]`).should("be.disabled");
    cy.get(`[data-cy="servicos"]`).should("be.disabled");
    cy.get(`[data-cy="pagamento"]`).should("be.disabled");
  });

  it("Realiza corretamente o cadastro da venda com produtos", () => {
    cy.get(`[data-cy="nome-vendedor"]`).should("be.visible");
    cy.get(`#cliente`)
      .should("be.visible")
      .type("Dione")
      .then(() => {
        cy.contains("Dione");
        cy.wait(2000);
        cy.get(`#cliente`).type("Dione{enter}");
      });

    cy.get(`#email`)
      .should("be.visible")
      .should("have.value", "dsoggee0@kickstarter.com");
    cy.get(`#celular`).should("be.visible");
    cy.get(`#telefone`).should("be.visible");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.wait(4000);

    cy.get(`[data-cy="finalizar"]`).should("be.visible");

    cy.get(`[data-cy="produtos"]`).should("not.be.disabled");
    cy.get(`[data-cy="servicos"]`).should("not.be.disabled");
    cy.get(`[data-cy="pagamento"]`).should("not.be.disabled");

    cy.get(`[data-cy="produtos"]`).click();

    cy.get(`#produto`)
      .should("be.visible")
      .type("Abacate")
      .then(() => {
        cy.contains("Abacate");
        cy.wait(2000);
        cy.get(`#produto`).type("Abacate{enter}");
      });
    cy.get(`#precoUnitario`).should("be.visible");

    cy.wait(2000);

    cy.get(`#quantidade`).should("be.visible").type("10.00").focus().blur();
    cy.get(`#outrasDespesas`).should("be.visible").type("2.00").focus().blur();
    cy.get(`#desconto`).should("be.visible").type("1.50").focus().blur();
    cy.get(`#valorTotal`).should("be.visible");

    cy.get(`[data-cy="adicionar-produto"]`).should("be.visible").click();
    cy.wait(5000);

    cy.get(`#quantidade`).should("have.value", "");
    cy.get(`#outrasDespesas`).should("have.value", "");
    cy.get(`#desconto`).should("have.value", "");
    cy.get(`#valorTotal`).should("have.value", "");

    cy.get("#table-produtos").should("be.visible").contains("td", "Abacate");
    cy.wait(3000);

    cy.get(`[aria-label="Editar produto"]`).should("be.visible").click();
    cy.get(`#quantidade`).should("be.visible").clear();
    cy.get(`#quantidade`).should("be.visible").type("15.00").focus().blur();
    cy.get(`[data-cy="adicionar-produto"]`).should("be.visible").click();

    cy.wait(3000);

    cy.get(`#produto`)
      .should("be.visible")
      .type("Couve")
      .then(() => {
        cy.contains("Couve");
        cy.wait(2000);
        cy.get(`#produto`).type("Couve{enter}");
      });
    cy.get(`#precoUnitario`).should("be.visible");

    cy.wait(2000);

    cy.get(`#quantidade`).should("be.visible").type("10.00").focus().blur();
    cy.get(`#outrasDespesas`).should("be.visible").type("2.00").focus().blur();
    cy.get(`#desconto`).should("be.visible").type("1.50").focus().blur();
    cy.get(`#valorTotal`).should("be.visible");

    cy.get(`[data-cy="adicionar-produto"]`).should("be.visible").click();

    cy.wait(5000);

    cy.get("#table-produtos")
      .should("be.visible")
      .contains("td", "Couve")
      .then(() => {
        cy.get(`[aria-label="Remover produto"]`)
          .eq(1)
          .should("be.visible")
          .click();
        cy.wait(2000);
        cy.get('[data-test-id="remover"]').should("be.visible");
        cy.get('[data-test-id="remover"]').first().click({ force: true });
      });

    cy.wait(3000);

    cy.get(`[data-cy="pagamento"]`).click();
    cy.get(`#pagamento`).should("be.visible").type("80.00").focus().blur();
    cy.get(`#troco`).should("be.visible");
    cy.get(`#valorTotalVenda`).should("be.visible");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();
  });
});
