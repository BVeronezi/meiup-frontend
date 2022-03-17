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
import {
  getFornecedores,
  useFornecedores,
} from "../../hooks/fornecedores/useFornecedores";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { theme as customTheme } from "../../styles/theme";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Fornecedores() {
  const router = useRouter();
  const [selectedFornecedor, setSelectedFornecedor] = useState({
    id: "",
    nome: "",
  });
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [value, setValue] = useState({
    fornecedores: [],
    totalCount: 0,
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  let { data, isLoading, error } = useFornecedores(page, {
    initialData: null,
  });

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function deleteFornecedor(fornecedorId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.delete(`/fornecedores/${fornecedorId}`);
      const data = await getFornecedores(page, null);
      setValue(data);

      toast({
        title: "Fornecedor removido com sucesso!",
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
      const fornecedoresPesquisados = await getFornecedores(
        1,
        event.target.value
      );
      setValue(fornecedoresPesquisados);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      setValue(data);
      setIsFetching(false);
    }
  }

  async function handlePrefetchFornecedor(fornecedorId: string) {
    await queryClient.prefetchQuery(
      ["fornecedor", fornecedorId],
      async () => {
        const response = await api.get(`/fornecedores/${fornecedorId}`);

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
        <title>MEIUP | Fornecedores</title>
      </Head>
      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisa} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/fornecedores/form" passHref>
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
                      Novo fornecedor
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Novo fornecedor">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Novo fornecedor"
                      onClick={() => router.push("/fornecedores/form")}
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
                <Text>Falha ao obter dados dos fornecedores.</Text>
              </Flex>
            ) : (
              <>
                {value?.fornecedores.length === 0 ? (
                  <Flex justify="center">
                    <Text>Nenhum fornecedor encontrado.</Text>
                  </Flex>
                ) : (
                  <>
                    <Box color="black">
                      <Table variant="striped" colorScheme="blackAlpha">
                        <Thead>
                          <Tr>
                            <Th>Nome</Th>
                            <Th>Celular</Th>
                            <Th>Telefone</Th>
                            <Th width="8">Ações</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {value?.fornecedores.map((fornecedor) => {
                            return (
                              <Tr key={fornecedor.id}>
                                <Td>
                                  <Box>
                                    <Link
                                      color="gray.900"
                                      onMouseEnter={() =>
                                        handlePrefetchFornecedor(fornecedor.id)
                                      }
                                    >
                                      <Text
                                        data-cy="nome-fornecedor"
                                        fontWeight="bold"
                                      >
                                        {fornecedor.nome}
                                      </Text>
                                    </Link>

                                    <Text fontSize="sm">
                                      {fornecedor.email}
                                    </Text>
                                  </Box>
                                </Td>

                                <Td>
                                  <Text>{fornecedor.celular}</Text>
                                </Td>

                                <Td>
                                  <Text>{fornecedor.telefone}</Text>
                                </Td>

                                <Td>
                                  <HStack>
                                    <IconButton
                                      variant="outline"
                                      color="blue.800"
                                      aria-label="Editar fornecedor"
                                      icon={<RiPencilLine />}
                                      onClick={() => {
                                        router.push({
                                          pathname: "/fornecedores/form",
                                          query: fornecedor.id,
                                        });
                                      }}
                                    />

                                    <IconButton
                                      variant="outline"
                                      color="red.800"
                                      aria-label="Excluir fornecedor"
                                      icon={<RiDeleteBinLine />}
                                      onClick={() => {
                                        {
                                          setSelectedFornecedor(fornecedor);
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
              header="Remover Fornecedor"
              body="Tem certeza que deseja remover o fornecedor"
              description={selectedFornecedor.nome}
              onClick={() => deleteFornecedor(selectedFornecedor.id)}
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
