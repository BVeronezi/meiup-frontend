Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/auth/login`,
    body: { email: "teste@gmail.com", senha: "123456" },
  }).then((res) => {
    cy.setCookie("meiup.token", res.body.token);
  });

  cy.getCookie("meiup.token").should("exist");
});
