import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { queryClient } from "../services/queryClient";
import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
export default MyApp;
