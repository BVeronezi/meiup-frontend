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
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiEyeLine,
  RiPencilLine,
  RiPrinterLine,
} from "react-icons/ri";
import { LoadPage } from "../../components/Load";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/Table";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";
import { Pesquisa } from "../../fragments/pesquisa";
import { getVendas, useVendas } from "../../hooks/vendas/useVendas";
import VendaPDF from "../../reports/vendas/report-venda";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { theme as customTheme } from "../../styles/theme";
import { withSSRAuth } from "../../utils/withSSRAuth";

export const StatusVenda = [
  { codigo: 0, label: "ABERTA" },
  { codigo: 1, label: "FINALIZADA" },
  { codigo: 2, label: "CANCELADA" },
];

export default function Vendas({ vendas }) {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const router = useRouter();
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

  let { data, isLoading, error } = useVendas(page, {
    initialData: null,
  });

  const [selectedVenda, setSelectedVenda] = useState("");

  const [value, setValue] = useState(data);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isFinalizaVenda, setIsFinalizaVenda] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function cancelaVenda(vendaId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.patch(`/vendas/cancela/${vendaId}`);

      toast({
        title: "Venda cancelada com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      router.reload();
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

  async function finalizarVenda(vendaId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.patch(`/vendas/finaliza/${vendaId}`);

      toast({
        title: "Venda finalizada com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      router.reload();
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

  async function handlePrefetchVenda(vendaId: number) {
    await queryClient.prefetchQuery(
      ["venda", vendaId],
      async () => {
        const response = await api.get(`/vendas/${vendaId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutes
      }
    );
  }

  async function handlePesquisaVenda(event) {
    if (event.target.value.length > 3) {
      setIsFetching(true);
      const vendasPesquisadas = await getVendas(1, event.target.value);
      setValue(vendasPesquisadas);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      setValue(data);
      setIsFetching(false);
    }
  }

  const gerarRelatorio = async (vendaId) => {
    const responseVenda = await api.get(`/vendas/${vendaId}`);
    const produtos = await api.get(`/produtosVenda`, {
      params: { vendaId: vendaId },
    });

    const servicos = await api.get(`/servicosVenda`, {
      params: { vendaId: vendaId },
    });

    VendaPDF(
      responseVenda.data.venda,
      produtos.data.found.produtosVenda,
      servicos.data.found.servicosVenda
    );
  };

  return (
    <>
      <Head>
        <title>MEIUP | Vendas</title>
      </Head>
      <LoadPage active={isLoadingPage}>
        <Sidebar>
          <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Pesquisa handleChange={handlePesquisaVenda} />
              <Box ml="4">
                {isWideVersion && (
                  <NextLink href="/vendas/form" passHref>
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
                      Nova venda
                    </Button>
                  </NextLink>
                )}

                {!isWideVersion && (
                  <Tooltip label="Nova venda">
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Nova venda"
                      onClick={() => router.push("/vendas/form")}
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
                <Text>Falha ao obter dados das vendas.</Text>
              </Flex>
            ) : (
              <>
                {value?.vendas.length === 0 ? (
                  <Flex justify="center">
                    <Text>Nenhuma venda encontrada.</Text>
                  </Flex>
                ) : (
                  <>
                    <Box color="black">
                      <Table variant="striped" colorScheme="blackAlpha">
                        <Thead>
                          <Tr>
                            <Th>Código</Th>
                            <Th>Cliente</Th>
                            <Th>Data da venda</Th>
                            <Th>Valor total</Th>
                            <Th>Status</Th>
                            <Th width="8">Ações</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {value?.vendas.map((venda) => {
                            return (
                              <Tr key={venda.id}>
                                <Td>
                                  <Box>
                                    <Link
                                      color="blue.900"
                                      onMouseEnter={() =>
                                        handlePrefetchVenda(Number(venda.id))
                                      }
                                    >
                                      <Text>{venda.id}</Text>
                                    </Link>
                                  </Box>
                                </Td>

                                <Td>
                                  <Text>{venda.cliente}</Text>
                                </Td>

                                <Td>
                                  <Text>{venda.dataVenda}</Text>
                                </Td>

                                <Td>
                                  <Text>{venda.valorTotal}</Text>
                                </Td>

                                <Td>
                                  <Text>{StatusVenda[venda.status].label}</Text>
                                </Td>

                                <Td>
                                  <HStack>
                                    {Number(venda.status) !== 0 && (
                                      <Tooltip label="Visualizar venda">
                                        <IconButton
                                          size="sm"
                                          variant="outline"
                                          color="blue.800"
                                          aria-label="Visualizar venda"
                                          icon={<RiEyeLine />}
                                          onClick={() => {
                                            router.push({
                                              pathname: "/vendas/form",
                                              query: String(venda.id),
                                            });
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                    {Number(venda.status) === 0 && (
                                      <Tooltip label="Editar venda">
                                        <IconButton
                                          size="sm"
                                          variant="outline"
                                          color="blue.800"
                                          aria-label="Editar venda"
                                          icon={<RiPencilLine />}
                                          onClick={() => {
                                            router.push({
                                              pathname: "/vendas/form",
                                              query: String(venda.id),
                                            });
                                          }}
                                        />
                                      </Tooltip>
                                    )}

                                    {Number(venda.status) === 0 && (
                                      <Tooltip label="Finalizar venda">
                                        <IconButton
                                          size="sm"
                                          variant="outline"
                                          color="blue.800"
                                          aria-label="Finalizar venda"
                                          icon={<RiCheckboxCircleLine />}
                                          onClick={() => {
                                            {
                                              setSelectedVenda(
                                                String(venda.id)
                                              );
                                              setIsFinalizaVenda(true);
                                              setIsOpen(true);
                                            }
                                          }}
                                        />
                                      </Tooltip>
                                    )}

                                    {Number(venda.status) !== 2 && (
                                      <Tooltip label="Cancelar venda">
                                        <IconButton
                                          size="sm"
                                          variant="outline"
                                          color="red.800"
                                          aria-label="Cancelar venda"
                                          icon={<RiCloseCircleLine />}
                                          onClick={() => {
                                            {
                                              setSelectedVenda(
                                                String(venda.id)
                                              );
                                              setIsFinalizaVenda(false);
                                              setIsOpen(true);
                                            }
                                          }}
                                        />
                                      </Tooltip>
                                    )}

                                    {Number(venda.status) === 1 && (
                                      <Tooltip label="Imprimir venda">
                                        <IconButton
                                          size="sm"
                                          variant="outline"
                                          color="blue.800"
                                          aria-label="Imprimir venda"
                                          icon={<RiPrinterLine />}
                                          onClick={() => {
                                            gerarRelatorio(venda.id);
                                          }}
                                        />
                                      </Tooltip>
                                    )}
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

            {isFinalizaVenda ? (
              <AlertDialogList
                isOpen={isOpen}
                cancelRef={cancelRef}
                onClose={onClose}
                header="Finalizar venda"
                body="Tem certeza que deseja finalizar a venda"
                description={selectedVenda}
                textButton1="Não"
                textButton2="Sim"
                onClick={() => finalizarVenda(selectedVenda)}
              />
            ) : (
              <AlertDialogList
                isOpen={isOpen}
                cancelRef={cancelRef}
                onClose={onClose}
                header="Cancelar venda"
                body="Tem certeza que deseja cancelar a venda"
                description={selectedVenda}
                textButton1="Não"
                textButton2="Sim"
                onClick={() => cancelaVenda(selectedVenda)}
              />
            )}
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
