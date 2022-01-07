import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import { GetServerSideProps } from "next";
import { getProdutos, useProdutos } from "../../hooks/produtos/useProdutos";
import { Sidebar } from "../../components/Sidebar";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/Table";

export default function Produtos({ produtos }) {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const router = useRouter();
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

  let { data, isLoading, error } = useProdutos(page, {
    initialData: produtos,
  });

  const [theData, setTheData] = useState(data);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  useEffect(() => {
    setTheData(data);
  }, [data]);

  async function deleteProduto(produtoId: string) {
    try {
      onClose();

      await api.delete(`/produtos/${produtoId}`);

      toast({
        title: "Produto removido com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      router.reload();
    } catch (error) {
      console.log(error);
    }
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
      const produtosPesquisados = await getProdutos(
        1,
        undefined,
        event.target.value
      );
      setTheData(produtosPesquisados);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      setTheData(data);
      setIsFetching(false);
    }
  }

  return (
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
                {theData?.produtos.map((produto) => {
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
                              setIsOpen(true);
                            }}
                          />
                        </HStack>

                        <AlertDialogList
                          isOpen={isOpen}
                          cancelRef={cancelRef}
                          onClose={onClose}
                          header="Remover Produto"
                          body="Tem certeza que deseja remover o produto"
                          description={produto.descricao}
                          handleDelete={() => deleteProduto(String(produto.id))}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            <Pagination
              totalCountOfRegisters={data.totalCount}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </Box>
    </Sidebar>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { produtos } = await getProdutos(1, ctx);

  return {
    props: {
      produtos,
    },
  };
};
