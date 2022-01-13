import { css } from "@emotion/react";
import LoadingOverlay from "react-loading-overlay";
import { ScaleLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
`;

export function LoadPage({ active, children }) {
  return (
    <LoadingOverlay
      active={active}
      spinner={<ScaleLoader color="black" css={override} />}
      fadeSpeed={0}
      text="Carregando..."
    >
      {children}
    </LoadingOverlay>
  );
}
