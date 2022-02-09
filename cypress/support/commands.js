import "@testing-library/cypress/add-commands";

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/auth/login`,
    body: { email: "mei@gmail.com", senha: "123456" },
  }).then((res) => {
    cy.setCookie("meiup.token", res.body.token);
  });

  cy.getCookie("meiup.token").should("exist");
});

Cypress.Commands.add("endereco", () => {
  cy.get(`[data-cy="endereco"]`).should("be.visible").click();

  cy.get(`#cep`).clear();
  cy.get(`#cep`).should("be.visible").type("31330700");

  cy.get("#toast-1-title").should("be.visible").contains("CEP não encontrado");

  cy.get(`#endereco`).should("have.value", "");
  cy.get(`#numero`).should("have.value", "");
  cy.get(`#bairro`).should("have.value", "");
  cy.get(`#cidade`).should("have.value", "");
  cy.get(`#estado`).should("have.value", "");
  cy.get(`#complemento`).should("have.value", "");

  cy.get(`#cep`).should("be.visible").clear();
  cy.get(".css-1xy7m1b").click();

  cy.get(`#cep`).should("be.visible").type("31330670");
  cy.get(`#endereco`).should("be.visible");
  cy.get(`#numero`).should("be.visible").type("12345");
  cy.get(`#bairro`).should("be.visible");
  cy.get(`#cidade`).should("be.visible");
  cy.get(`#estado`).should("be.visible");
  cy.get(`#complemento`).should("be.visible").type("Apto 123");
});
