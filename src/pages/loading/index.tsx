import { Box, Flex, Text } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import Router from "next/router";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import { api } from "../../services/apiClient";

type User = {
  email: string;
  nome: string;
  empresa: Empresa;
  tipo: string[];
};

type Empresa = {
  id: string;
  razaoSocial: string;
};

export default function Loading({ jwt, newUser }) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const { email, nome, empresa, tipo } = JSON.parse(newUser);

    setCookie(undefined, "meiup.token", jwt, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    setUser({
      email,
      empresa,
      nome,
      tipo,
    });

    api.defaults.headers["Authorization"] = `Bearer ${jwt}`;

    Router.push("/dashboard");
  }, [jwt, newUser]);

  return (
    <>
      <Box>
        <Flex justify="center">
          <Box w="100%" p="60">
            <Box align="center">
              <CircularProgress isIndeterminate color="gray.300" />
              <Text color="black">Carregando...</Text>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      jwt: context.query.jwt,
      newUser: context.query.user,
    },
  };
}
