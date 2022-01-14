import { extendTheme, Theme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    gray: {
      "100": "#f5f6fa",
      "200": "#dcdde1",
      "500": "#7f8fa6",
      "700": "#718093",
      "900": "#2D2D2D",
    },
    yellow: {
      "900": "#F8C33B",
    },
    blue: {
      "500": "#40739E",
      "700": "#487EB0",
    },
    red: {
      "700": "#C23616",
    },
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  textStyles: {
    a: {
      textDecoration: "underline",
    },
  },
});
