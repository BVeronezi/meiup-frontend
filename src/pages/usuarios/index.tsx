import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Spinner,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  RiAddBoxLine,
  RiAddLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri";
import { LoadPage } from "../../components/Load";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/Table";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";
import { Pesquisa } from "../../fragments/pesquisa";
import { getUsuarios, useUsuarios } from "../../hooks/usuario/useUsers";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { theme as customTheme } from "../../styles/theme";
import { withSSRAuth } from "../../utils/withSSRAuth";

enum Perfil {
  "ADMIN" = "Administrador",
  "USER" = "Funcionário",
}

export default function Usuarios() {
  const router = useRouter();
  const toast = createStandaloneToast({ theme: customTheme });
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const [selectedUsuario, setSelectedUsuario] = useState({ id: "", email: "" });
  const [page, setPage] = useState(1);

  const [value, setValue] = useState({
    users: [],
    totalCount: 0,
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  let { data, isLoading, error } = useUsuarios(page, {
    initialData: null,
  });

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function deleteUser(userId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.delete(`/usuario/${userId}`);
      const data = await getUsuarios(page, null);
      setValue(data);

      toast({
        title: "Usuário removido com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoadingPage(false);
  }

  async function handlePesquisa(event) {
    if (event.target.value.length > 3) {
      setIsFetching(true);
      const usuariosPesquisados = await getUsuarios(1, event.target.value);

      setValue(usuariosPesquisados);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      setValue(data);
      setIsFetching(false);
    }
  }

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(
      ["usuario", userId],
      async () => {
        const response = await api.get(`/usuario/${userId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutes
      }
    );
  }

  return (
    <>
      <Head>
        <title>MEIUP | Usuários</title>
      </Head>

      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisa} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/usuarios/form" passHref>
                    <Button
                      _hover={{
                        bg: "blue.500",
                      }}
                      as="a"
                      size="sm"
                      fontSize="sm"
                      color="white"
                      backgroundColor="blue.800"
                      leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                    >
                      Novo usuário
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Novo usuário">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Novo usuário"
                      onClick={() => router.push("/usuarios/form")}
                      icon={<RiAddBoxLine />}
                    />
                  </Tooltip>
                )}
              </Box>
            </Flex>

            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados dos usuários.</Text>
              </Flex>
            ) : (
              <>
                {value?.users.length === 0 ? (
                  <Flex justify="center">
                    <Text>Nenhum usuário encontrado.</Text>
                  </Flex>
                ) : (
                  <Box color="black">
                    <Table variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th>Usuário</Th>
                          <Th>Perfil</Th>
                          {isWideVersion && <Th>Data de cadastro</Th>}
                          <Th width="8">Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {value?.users.map((user) => {
                          return (
                            <Tr data-cy="usuario" key={user.id}>
                              <Td>
                                <Box>
                                  <Link
                                    color="gray.900"
                                    onMouseEnter={() =>
                                      handlePrefetchUser(user.id)
                                    }
                                  >
                                    <Text
                                      data-cy="nome-usuario"
                                      fontWeight="bold"
                                    >
                                      {user.nome}
                                    </Text>
                                  </Link>

                                  <Text data-cy="email-usuario" fontSize="sm">
                                    {user.email}
                                  </Text>
                                </Box>
                              </Td>

                              <Td>
                                <Text>{Perfil[user.perfil]}</Text>
                              </Td>

                              {isWideVersion && <Td>{user.createdAt}</Td>}
                              <Td>
                                <HStack>
                                  <IconButton
                                    variant="outline"
                                    color="blue.800"
                                    aria-label="Editar usuário"
                                    icon={<RiPencilLine />}
                                    onClick={() => {
                                      router.push({
                                        pathname: "/usuarios/form",
                                        query: user.id,
                                      });
                                    }}
                                  />

                                  <IconButton
                                    variant="outline"
                                    color="red.800"
                                    aria-label="Excluir usuário"
                                    icon={<RiDeleteBinLine />}
                                    onClick={() => {
                                      {
                                        setSelectedUsuario(user);
                                        setIsOpen(true);
                                      }
                                    }}
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>

                    <Pagination
                      totalCountOfRegisters={data?.totalCount}
                      currentPage={page}
                      onPageChange={setPage}
                    />
                  </Box>
                )}
              </>
            )}

            <AlertDialogList
              isOpen={isOpen}
              cancelRef={cancelRef}
              onClose={onClose}
              header="Remover Usuário"
              body="Tem certeza que deseja remover o usuário"
              description={selectedUsuario.email}
              onClick={() => deleteUser(selectedUsuario.id)}
            />
          </Box>
        </Sidebar>
      </LoadPage>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
