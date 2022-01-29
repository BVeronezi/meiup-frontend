import { render, screen } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink component", () => {
  it("renderizando corretamente", () => {
    render(
      <ActiveLink href="/" passHref>
        <a>INÍCIO</a>
      </ActiveLink>
    );

    expect(screen.getByText("INÍCIO")).toBeInTheDocument();
  });
});
