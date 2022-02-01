import Head from "next/head";
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
import NextLink from "next/link";
import { useRouter } from "next/router";
import { theme as customTheme } from "../../styles/theme";
import { useEffect, useRef, useState } from "react";
import { LoadPage } from "../../components/Load";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { getClientes, useClientes } from "../../hooks/clientes/useClientes";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { Pesquisa } from "../../fragments/pesquisa";
import {
  RiAddBoxLine,
  RiAddLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/Table";
import { Pagination } from "../../components/Pagination";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";

export default function Clientes() {
  const router = useRouter();
  const [selectedCliente, setSelectedCliente] = useState({ id: "", nome: "" });
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [value, setValue] = useState({
    clientes: [],
    totalCount: 0,
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  let { data, isLoading, error } = useClientes(page, {
    initialData: null,
  });

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function deleteCliente(clienteId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.delete(`/clientes/${clienteId}`);
      const data = await getClientes(page, null);
      setValue(data);

      toast({
        title: "Cliente removido com sucesso!",
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
      const clientesPesquisados = await getClientes(
        1,
        undefined,
        event.target.value
      );
      setValue(clientesPesquisados);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      setValue(data);
      setIsFetching(false);
    }
  }

  async function handlePrefetcCliente(clienteId: string) {
    await queryClient.prefetchQuery(
      ["cliente", clienteId],
      async () => {
        const response = await api.get(`/clientes/${clienteId}`);

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
        <title>MEIUP | Clientes</title>
      </Head>
      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisa} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/clientes/form" passHref>
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
                      Novo cliente
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Novo cliente">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Novo cliente"
                      onClick={() => router.push("/clientes/form")}
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
                <Text>Falha ao obter dados dos clientes.</Text>
              </Flex>
            ) : (
              <>
                {value?.clientes.length === 0 ? (
                  <Flex justify="center">
                    <Text>Nenhum cliente encontrado.</Text>
                  </Flex>
                ) : (
                  <>
                    <Box color="black">
                      <Table variant="striped" colorScheme="blackAlpha">
                        <Thead>
                          <Tr>
                            <Th>Nome</Th>
                            <Th>Celular</Th>
                            <Th width="8">Ações</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {value?.clientes.map((cliente) => {
                            return (
                              <Tr key={cliente.id}>
                                <Td>
                                  <Box>
                                    <Link
                                      color="gray.900"
                                      onMouseEnter={() =>
                                        handlePrefetcCliente(cliente.id)
                                      }
                                    >
                                      <Text data-cy="nome-cliente" fontWeight="bold">
                                        {cliente.nome}
                                      </Text>
                                    </Link>

                                    <Text fontSize="sm">{cliente.email}</Text>
                                  </Box>
                                </Td>

                                <Td>
                                  <Text>{cliente.celular}</Text>
                                </Td>

                                <Td>
                                  <HStack>
                                    <IconButton
                                      variant="outline"
                                      color="blue.800"
                                      aria-label="Editar cliente"
                                      icon={<RiPencilLine />}
                                      onClick={() => {
                                        router.push({
                                          pathname: "/clientes/form",
                                          query: cliente.id,
                                        });
                                      }}
                                    />

                                    <IconButton
                                      variant="outline"
                                      color="red.800"
                                      aria-label="Excluir cliente"
                                      icon={<RiDeleteBinLine />}
                                      onClick={() => {
                                        {
                                          setSelectedCliente(cliente);
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
                  </>
                )}
              </>
            )}

            <AlertDialogList
              isOpen={isOpen}
              cancelRef={cancelRef}
              onClose={onClose}
              header="Remover Cliente"
              body="Tem certeza que deseja remover o cliente"
              description={selectedCliente.nome}
              onClick={() => deleteCliente(selectedCliente.id)}
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
