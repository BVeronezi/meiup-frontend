import { cleanup, render, screen } from "@testing-library/react";
import { waitFor, waitForElementToBeRemoved } from "@testing-library/dom";
import DadosGerais from "../../pages/dados-gerais";
import React from "react";

afterEach(cleanup);

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("axios", () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ data: {} })),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })),
  };
});

window.focus = jest.fn();

describe("Dados gerais", () => {
  beforeAll(() =>
    jest.spyOn(React, "useEffect").mockImplementation(React.useLayoutEffect)
  );

  it("renderizando corretamente", () => {
    render(<DadosGerais />);
  });

  it("apresentar o load enquanto busca os dados da empresa", async () => {
    const { getByText } = render(<DadosGerais />);

    await waitFor(() => getByText("Carregando..."));
  });
});
