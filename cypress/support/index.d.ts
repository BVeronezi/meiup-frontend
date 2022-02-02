declare namespace Cypress {
  interface Chainable {
    login(): () => void;
    endereco(): () => void;
  }
}
