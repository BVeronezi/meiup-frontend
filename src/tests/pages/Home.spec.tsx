import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import { act } from "react-dom/test-utils";
import { mocked } from "ts-jest/utils";
import Home from "../../pages";

jest.mock("next/router");

describe("Página inicial", () => {
  it("renderizando corretamente", () => {
    render(<Home />);

    expect(screen.getByText("Comece já")).toBeInTheDocument();
  });
});
