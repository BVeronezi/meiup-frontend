import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  Text,
  Icon,
  Progress,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  HStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { ContainerPage } from "../../components/ContainerPage";
import { theme as customTheme } from "../../styles/theme";
import { useEffect, useRef, useState } from "react";
import { Pesquisa } from "../../fragments/pesquisa";
import {
  RiAddLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiPencilLine,
} from "react-icons/ri";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/apiClient";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";
import { Pagination } from "../../components/Pagination";
import { getVendas, useVendas } from "../../hooks/vendas/useVendas";
import { GetServerSideProps } from "next";

export const StatusVenda = [
  { codigo: 0, label: "ABERTA" },
  { codigo: 1, label: "FINALIZADA" },
  { codigo: 2, label: "CANCELADA" },
];

export default function Vendas({ vendas }) {
  const router = useRouter();
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

  let { data, isLoading, error } = useVendas(page, {
    initialData: vendas,
  });

  const [theData, setTheData] = useState(data);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  useEffect(() => {
    setTheData(data);
  }, [data]);

  async function cancelaVenda(vendaId: string) {
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
      console.log(error);
    }
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

  async function handlePesquisaVenda(event) {}

  return (
    <ContainerPage title="Vendas">
      <Box flex="1" borderRadius={8} boxShadow="base" p="8">
        <Flex mb="8" justify="space-between" align="center">
          <Pesquisa handleChange={handlePesquisaVenda} />
          <Box ml="4">
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
                Nova venda
              </Button>
            </NextLink>
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
          <Box color="black">
            <Table colorScheme="blackAlpha">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Cliente</Th>
                  <Th>Data da venda</Th>
                  <Th>Valor total</Th>
                  <Th>Status</Th>
                  <Th width="8"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {theData?.vendas.map((venda) => {
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
                            <Text fontWeight="bold">{venda.id}</Text>
                          </Link>
                        </Box>
                      </Td>

                      <Td>
                        <Text fontWeight="bold">{venda.cliente}</Text>
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

                          {Number(venda.status) !== 2 && (
                            <Tooltip label="Editar venda">
                              <IconButton
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

                          {Number(venda.status) !== 2 && (
                            <Tooltip label="Finalizar venda">
                              <IconButton
                                variant="outline"
                                color="blue.800"
                                aria-label="Finalizar venda"
                                icon={<RiCheckboxCircleLine />}
                                onClick={() => {
                                  setIsOpen(true);
                                }}
                              />
                            </Tooltip>
                          )}

                          {Number(venda.status) !== 2 && (
                            <Tooltip label="Cancelar venda">
                              <IconButton
                                variant="outline"
                                color="red.800"
                                aria-label="Cancelar venda"
                                icon={<RiCloseCircleLine />}
                                onClick={() => {
                                  setIsOpen(true);
                                }}
                              />
                            </Tooltip>
                          )}
                        </HStack>

                        <AlertDialogList
                          isOpen={isOpen}
                          cancelRef={cancelRef}
                          onClose={onClose}
                          header="Cancelar venda"
                          body="Tem certeza que deseja cancelar a venda"
                          description={venda.id}
                          textButton1="Não"
                          textButton2="Sim"
                          handleDelete={() => cancelaVenda(String(venda.id))}
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
          </Box>
        )}
      </Box>
    </ContainerPage>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { vendas } = await getVendas(1, ctx);

  return {
    props: {
      vendas,
    },
  };
};
