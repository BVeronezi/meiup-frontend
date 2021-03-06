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
import { getPromocoes, usePromocoes } from "../../hooks/promocao/usePromocao";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { theme as customTheme } from "../../styles/theme";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Promocoes() {
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
  const [selectedPromocao, setSelectedPromocao] = useState({
    id: "",
    descricao: "",
  });

  const [value, setValue] = useState({
    promocoes: [],
    totalCount: 0,
  });

  let { data, isLoading, error } = usePromocoes(page, {
    initialData: null,
  });

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function deletePromocao(promocaoId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.delete(`/promocoes/${promocaoId}`);

      const data = await getPromocoes(page);
      setValue(data);

      toast({
        title: "Promo????o removida com sucesso!",
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

  async function handlePrefetchPromocao(servicoId: number) {
    await queryClient.prefetchQuery(
      ["servico", servicoId],
      async () => {
        const response = await api.get(`/promocoes/${servicoId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutes
      }
    );
  }

  async function handlePesquisaPromocao(event) {
    if (event.target.value.length > 3) {
      setIsFetching(true);
      const servicosPesquisados = await getPromocoes(1, event.target.value);
      setValue(servicosPesquisados);
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
        <title>MEIUP | Promo????es</title>
      </Head>
      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisaPromocao} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/promocoes/form" passHref>
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
                      Nova promo????o
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Nova promo????o">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Novo promo????o"
                      onClick={() => router.push("/promocoes/form")}
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
                <Text>Falha ao obter dados.</Text>
              </Flex>
            ) : (
              <>
                {value?.promocoes.length === 0 ? (
                  <Flex justify="center">
                    <Text>Nenhuma promo????o encontrada.</Text>
                  </Flex>
                ) : (
                  <>
                    <Table variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th>Descri????o</Th>
                          <Th>Data in??cio</Th>
                          <Th>Data fim</Th>
                          <Th width="8">A????es</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {value?.promocoes.map((promocao) => {
                          return (
                            <Tr key={promocao.id}>
                              <Td>
                                <Box>
                                  <Link
                                    color="gray.900"
                                    onMouseEnter={() =>
                                      handlePrefetchPromocao(
                                        Number(promocao.id)
                                      )
                                    }
                                  >
                                    <Text>{promocao.descricao}</Text>
                                  </Link>
                                </Box>
                              </Td>

                              <Td>
                                <Text>{promocao.dataInicio}</Text>
                              </Td>

                              <Td>
                                <Text>{promocao.dataFim}</Text>
                              </Td>

                              <Td>
                                <HStack>
                                  <IconButton
                                    variant="outline"
                                    color="blue.800"
                                    aria-label="Editar promo????o"
                                    icon={<RiPencilLine />}
                                    onClick={() => {
                                      router.push({
                                        pathname: "/promocoes/form",
                                        query: String(promocao.id),
                                      });
                                    }}
                                  />

                                  <IconButton
                                    variant="outline"
                                    color="red.800"
                                    aria-label="Excluir promo????o"
                                    icon={<RiDeleteBinLine />}
                                    onClick={() => {
                                      setSelectedPromocao(promocao);
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

                    <Pagination
                      totalCountOfRegisters={data?.totalCount}
                      currentPage={page}
                      onPageChange={setPage}
                    />
                  </>
                )}
              </>
            )}

            <AlertDialogList
              isOpen={isOpen}
              cancelRef={cancelRef}
              onClose={onClose}
              header="Remover Promo????o"
              body="Tem certeza que deseja remover a promo????o"
              description={selectedPromocao.descricao}
              onClick={() => deletePromocao(String(selectedPromocao.id))}
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
