import "@percy/cypress";

describe("Dados gerais", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Carregar a página de dashboard", () => {
    cy.visit("/dados-gerais");
    // Take a snapshot for visual diffing
    cy.percySnapshot();
  });

  it("Deve carregar os dados da empresa ao informar CNPJ válido", () => {
    // esperar API carregar os dados
    cy.wait(3000);
    cy.get(`#cnpj`).clear();
    cy.get(`#cnpj`).type("01067075000152");

    cy.get(`#cnpj`).should("have.value", "01067075000152");
    cy.get(`#razaoSocial`).should(
      "have.value",
      "ORGANIZACOES HORTI FRUTI BH LTDA"
    );
  });

  it("Deve consultar endereco ao informar o CEP válido", () => {
    cy.endereco();
  });

  it("Realizr atualização dos dados da empresa", () => {
    cy.get(`[data-cy="info-empresa"]`).should("be.visible").click();
    cy.get(`#email`).should("be.visible").clear();
    cy.get(`#email`).should("be.visible").type("hortifrutiteste@hotmail.com");

    cy.get(`[data-cy="salvar"]`).should("be.visible").click();

    cy.get(".chakra-toast > .chakra-toast__inner")
      .should("be.visible")
      .contains("Dados salvos com sucesso");

    cy.url().should("be.equal", `${Cypress.env("urlFront")}/dados-gerais`);
  });
});
