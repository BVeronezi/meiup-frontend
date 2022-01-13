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
import { theme as customTheme } from "../../styles/theme";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { getServicos, useServicos } from "../../hooks/servicos/useServicos";
import { Pesquisa } from "../../fragments/pesquisa";
import {
  RiAddBoxLine,
  RiAddLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../components/Table";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";
import { Pagination } from "../../components/Pagination";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { LoadPage } from "../../components/Load";

export default function Servicos() {
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
  const [selectedServico, setSelectedServico] = useState({
    id: "",
    nome: "",
  });

  const [value, setValue] = useState({
    servicos: [],
    totalCount: 0,
  });

  let { data, isLoading, error } = useServicos(page, {
    initialData: null,
  });

  useEffect(() => {
    async function fetchData() {
      setValue(data);
    }
    fetchData();
  }, [data]);

  async function deleteServico(servicoId: string) {
    setIsLoadingPage(true);
    try {
      onClose();

      await api.delete(`/servicos/${servicoId}`);

      const data = await getServicos(page, null);
      setValue(data);

      toast({
        title: "Serviço removido com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
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

  async function handlePesquisaServico(event) {
    if (event.target.value.length > 3) {
      setIsFetching(true);
      const servicosPesquisados = await getServicos(
        1,
        undefined,
        event.target.value
      );
      setValue(servicosPesquisados);
      setIsFetching(false);
    } else {
      setIsFetching(true);
      setValue(data);
      setIsFetching(false);
    }
  }

  return (
    <LoadPage active={isLoadingPage}>
      <Sidebar>
        <Box borderRadius={10} boxShadow="base" p={["2", "6"]}>
          <Flex mb="8" justify="space-between" align="center">
            <Pesquisa handleChange={handlePesquisaServico} />
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
              <Text>Falha ao obter dados dos servicos.</Text>
            </Flex>
          ) : (
            <>
              <Table variant="striped" colorScheme="blackAlpha">
                <Thead>
                  <Tr>
                    <Th>Serviço</Th>
                    <Th>Custo</Th>
                    <Th>Lucro</Th>
                    <Th>Margem Lucro</Th>
                    <Th width="8">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {value?.servicos.map((servico) => {
                    return (
                      <Tr key={servico.id}>
                        <Td>
                          <Box>
                            <Link
                              color="gray.900"
                              onMouseEnter={() =>
                                handlePrefetchServico(Number(servico.id))
                              }
                            >
                              <Text>{servico.nome}</Text>
                            </Link>
                          </Box>
                        </Td>

                        <Td>
                          <Text>{servico.custo}</Text>
                        </Td>

                        <Td>
                          <Text>{servico.valor}</Text>
                        </Td>

                        <Td>
                          <Text>{servico.margemLucro}</Text>
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
                                  pathname: "/servicos/form",
                                  query: String(servico.id),
                                });
                              }}
                            />

                            <IconButton
                              variant="outline"
                              color="red.800"
                              aria-label="Excluir serviço"
                              icon={<RiDeleteBinLine />}
                              onClick={() => {
                                setSelectedServico(servico);
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
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}

          <AlertDialogList
            isOpen={isOpen}
            cancelRef={cancelRef}
            onClose={onClose}
            header="Remover Serviço"
            body="Tem certeza que deseja remover o serviço"
            description={selectedServico.nome}
            onClick={() => deleteServico(String(selectedServico.id))}
          />
        </Box>
      </Sidebar>
    </LoadPage>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
