import "@percy/cypress";

describe("Vendas Serviço", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Realiza corretamente o cadastro da venda com serviço", () => {
    cy.visit("/vendas");
    cy.contains("Nova venda")
      .click()
      .then(() => {
        cy.location("pathname").should("eq", "/vendas/form");
      });

    cy.wait(2000);

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
    cy.get(`#celular`).should("be.visible").type("31994411234");
    cy.get(`#telefone`).should("be.visible").type("3130161234");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.wait(5000);

    cy.get(`[data-cy="finalizar"]`).should("be.visible");

    cy.get(`[data-cy="produtos"]`).should("not.be.disabled");
    cy.get(`[data-cy="servicos"]`).should("not.be.disabled");
    cy.get(`[data-cy="pagamento"]`).should("not.be.disabled");

    cy.get(`[data-cy="servicos"]`).click();

    cy.get(`#servico`)
      .should("be.visible")
      .type("Detox verde")
      .then(() => {
        cy.contains("Detox verde");
        cy.wait(2000);
        cy.get(`#servico`).type("Detox verde{enter}");
      });
    cy.get(`#valorServico`).should("be.visible");

    cy.wait(2000);

    cy.get(`#outrasDespesasServicos`)
      .should("be.visible")
      .type("2.00")
      .focus()
      .blur();
    cy.get(`#descontoServicos`)
      .should("be.visible")
      .type("1.50")
      .focus()
      .blur();
    cy.get(`#valorTotalServicos`).should("be.visible");

    cy.get(`[data-cy="adicionar-servico"]`).should("be.visible").click();
    cy.wait(5000);

    cy.get(`#outrasDespesasServicos`).should("have.value", "");
    cy.get(`#descontoServicos`).should("have.value", "");
    cy.get(`#valorTotalServicos`).should("have.value", "");

    cy.get("#table-servicos")
      .should("be.visible")
      .contains("td", "Detox verde");
    cy.wait(3000);

    cy.get(`[aria-label="Editar serviço"]`).should("be.visible").click();
    cy.get(`#outrasDespesasServicos`).should("be.visible").clear();
    cy.get(`#outrasDespesasServicos`)
      .should("be.visible")
      .type("2.00")
      .focus()
      .blur();
    cy.get(`[data-cy="adicionar-servico"]`).should("be.visible").click();

    cy.wait(4000);

    cy.get(`[data-cy="pagamento"]`).click();
    cy.get(`#pagamento`).should("be.visible").type("50.00").focus().blur();
    cy.get(`#troco`).should("be.visible");
    cy.get(`#valorTotalVenda`).should("be.visible");

    cy.wait(2000);
    cy.get(`[data-cy="finalizar"]`).should("be.visible").click();
  });
});
