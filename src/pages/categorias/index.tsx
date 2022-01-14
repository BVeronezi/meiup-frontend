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
  Progress,
  Spinner,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { theme as customTheme } from "../../styles/theme";
import { useEffect, useRef, useState } from "react";
import {
  getCategorias,
  useCategorias,
} from "../../hooks/categorias/useCategorias";
import { LoadPage } from "../../components/Load";
import { Pesquisa } from "../../fragments/pesquisa";
import NextLink from "next/link";
import {
  RiAddBoxLine,
  RiAddLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/Table";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/apiClient";
import { Pagination } from "../../components/Pagination";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";

export default function Categorias() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const router = useRouter();
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [selectedCategoria, setSelectedCategoria] = useState({
    id: "",
    nome: "",
  });

  const [value, setValue] = useState({
    categorias: [],
    totalCount: 0,
  });

  let { data, isLoading, error } = useCategorias(page, {
    initialData: null,
  });

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function deleteCategoria(categoriaId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      const result = await api.delete(`/categorias/${categoriaId}`);

      const data = await getCategorias(page, null);
      setValue(data);

      if (result.data) {
        toast({
          title: "Categoria removida com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
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

  async function handlePrefetchCategoria(categoriaId: number) {
    await queryClient.prefetchQuery(
      ["categoria", categoriaId],
      async () => {
        const response = await api.get(`/categorias/${categoriaId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutes
      }
    );
  }

  async function handlePesquisaCategoria(event) {
    if (event.target.value.length > 3) {
      setIsFetching(true);
      const categoriasPesquisadas = await getCategorias(
        1,
        undefined,
        event.target.value
      );
      setValue(categoriasPesquisadas);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      setValue(data);
      setIsFetching(false);
    }
  }

  return (
    <>
      <Head>
        <title>MEIUP | Categorias</title>
      </Head>
      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisaCategoria} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/categorias/form" passHref>
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
                      Nova categoria
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Nova categoria">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Nova categoria"
                      onClick={() => router.push("/categorias/form")}
                      icon={<RiAddBoxLine />}
                    />
                  </Tooltip>
                )}
              </Box>
            </Flex>

            {isFetching && <Progress size="xs" isIndeterminate />}

            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados das categorias.</Text>
              </Flex>
            ) : (
              <Box>
                <Table variant="striped" colorScheme="blackAlpha">
                  <Thead>
                    <Tr>
                      <Th>Código</Th>
                      <Th>Categoria</Th>
                      <Th width="8">Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {value?.categorias.map((categoria) => {
                      return (
                        <Tr key={categoria.id}>
                          <Td>
                            <Box>
                              <Link
                                color="gray.900"
                                onMouseEnter={() =>
                                  handlePrefetchCategoria(Number(categoria.id))
                                }
                              >
                                <Text>{categoria.id}</Text>
                              </Link>
                            </Box>
                          </Td>

                          <Td>
                            <Text>{categoria.nome}</Text>
                          </Td>

                          <Td>
                            <HStack>
                              <IconButton
                                variant="outline"
                                color="blue.800"
                                aria-label="Editar categoria"
                                icon={<RiPencilLine />}
                                onClick={() => {
                                  router.push({
                                    pathname: "/categorias/form",
                                    query: String(categoria.id),
                                  });
                                }}
                              />

                              <IconButton
                                variant="outline"
                                color="red.800"
                                aria-label="Excluir categoria"
                                icon={<RiDeleteBinLine />}
                                onClick={() => {
                                  setSelectedCategoria(categoria);
                                  setIsOpen(true);
                                }}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>

                {!isLoadingPage && (
                  <Pagination
                    totalCountOfRegisters={data.totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                )}
              </Box>
            )}

            <AlertDialogList
              isOpen={isOpen}
              cancelRef={cancelRef}
              onClose={onClose}
              header="Remover Categoria"
              body="Tem certeza que deseja remover a categoria"
              description={selectedCategoria.nome}
              onClick={() => deleteCategoria(String(selectedCategoria.id))}
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
