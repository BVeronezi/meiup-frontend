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
import { useEffect, useRef, useState } from "react";
import { Pesquisa } from "../../fragments/pesquisa";
import { api } from "../../services/apiClient";
import NextLink from "next/link";
import { queryClient } from "../../services/queryClient";
import {
  RiAddBoxLine,
  RiAddLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import { theme as customTheme } from "../../styles/theme";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";
import { getProdutos, useProdutos } from "../../hooks/produtos/useProdutos";
import { Sidebar } from "../../components/Sidebar";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/Table";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { LoadPage } from "../../components/Load";

export default function Produtos() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const router = useRouter();
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const [selectedProduto, setSelectedProduto] = useState({
    id: "",
    descricao: "",
  });

  const [value, setValue] = useState({
    produtos: [],
    totalCount: 0,
  });

  let { data, isLoading, error } = useProdutos(page, {
    initialData: null,
  });

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function deleteProduto(produtoId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      const result = await api.delete(`/produtos/${produtoId}`);

      const data = await getProdutos(page, null);
      setValue(data);

      if (result.data) {
        toast({
          title: "Produto removido com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Não é possível excluir, produto utilizado como insumo!",
          status: "error",
          duration: 3000,
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

  async function handlePrefetchProduto(produtoId: number) {
    await queryClient.prefetchQuery(
      ["produto", produtoId],
      async () => {
        const response = await api.get(`/produtos/${produtoId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutes
      }
    );
  }

  async function handlePesquisaProduto(event) {
    if (event.target.value.length > 3) {
      setIsFetching(true);
      const produtosPesquisados = await getProdutos(1, event.target.value);
      setValue(produtosPesquisados);
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
        <title>MEIUP | Produtos</title>
      </Head>
      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisaProduto} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/produtos/form" passHref>
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
                      Novo produto
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Novo produto">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Novo produto"
                      onClick={() => router.push("/produtos/form")}
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
                <Text>Falha ao obter dados dos produtos.</Text>
              </Flex>
            ) : (
              <>
                {value?.produtos.length === 0 ? (
                  <Flex justify="center">
                    <Text>Nenhum produto encontrado.</Text>
                  </Flex>
                ) : (
                  <Box>
                    <Table variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th>Produto</Th>
                          <Th>Categoria</Th>
                          <Th>Preço venda</Th>
                          <Th width="8">Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {value?.produtos.map((produto) => {
                          return (
                            <Tr key={produto.id}>
                              <Td>
                                <Box>
                                  <Link
                                    color="gray.900"
                                    onMouseEnter={() =>
                                      handlePrefetchProduto(Number(produto.id))
                                    }
                                  >
                                    <Text>{produto.descricao}</Text>
                                  </Link>
                                </Box>
                              </Td>

                              <Td>
                                <Text>{produto.categoria}</Text>
                              </Td>

                              <Td>
                                <Text>{produto.precoVarejo}</Text>
                              </Td>

                              <Td>
                                <HStack>
                                  <IconButton
                                    variant="outline"
                                    color="blue.800"
                                    aria-label="Editar produto"
                                    icon={<RiPencilLine />}
                                    onClick={() => {
                                      router.push({
                                        pathname: "/produtos/form",
                                        query: String(produto.id),
                                      });
                                    }}
                                  />

                                  <IconButton
                                    variant="outline"
                                    color="red.800"
                                    aria-label="Excluir produto"
                                    icon={<RiDeleteBinLine />}
                                    onClick={() => {
                                      setSelectedProduto(produto);
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
                        totalCountOfRegisters={data?.totalCount}
                        currentPage={page}
                        onPageChange={setPage}
                      />
                    )}
                  </Box>
                )}
              </>
            )}

            <AlertDialogList
              isOpen={isOpen}
              cancelRef={cancelRef}
              onClose={onClose}
              header="Remover Produto"
              body="Tem certeza que deseja remover o produto"
              description={selectedProduto.descricao}
              onClick={() => deleteProduto(String(selectedProduto.id))}
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
