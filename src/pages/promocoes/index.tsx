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
import { usePromocoes } from "../../hooks/promocao/usePromocao";
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

  async function deleteServico(promocaoId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.delete(`/promocoes/${promocaoId}`);

      // const data = await getServicos(page, null);
      // setValue(data);

      toast({
        title: "Promoção removida com sucesso!",
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

  async function handlePrefetchServico(servicoId: number) {
    await queryClient.prefetchQuery(
      ["servico", servicoId],
      async () => {
        const response = await api.get(`/servicos/${servicoId}`);

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
      // const servicosPesquisados = await getServicos(
      //   1,
      //   undefined,
      //   event.target.value
      // );
      // setValue(servicosPesquisados);
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
        <title>MEIUP | Promoções</title>
      </Head>
      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisaPromocao} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/servicos/form" passHref>
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
                      Novo serviço
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Novo servico">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Novo servico"
                      onClick={() => router.push("/servicos/form")}
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
                    <Text>Nenhuma promoção encontrada.</Text>
                  </Flex>
                ) : (
                  <>
                    <Table variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th>Descrição</Th>
                          <Th>Data início</Th>
                          <Th>Data fim</Th>
                          <Th width="8">Ações</Th>
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
                                      handlePrefetchServico(Number(promocao.id))
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
                                    aria-label="Editar serviço"
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
                                    aria-label="Excluir promoçõ"
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
              header="Remover Promoção"
              body="Tem certeza que deseja remover a promoção"
              description={selectedPromocao.descricao}
              onClick={() => deleteServico(String(selectedPromocao.id))}
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
