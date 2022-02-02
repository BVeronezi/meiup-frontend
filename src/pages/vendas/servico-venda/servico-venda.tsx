import {
  createStandaloneToast,
  SimpleGrid,
  Text,
  VStack,
  Skeleton,
  Box,
  HStack,
  Button,
  Divider,
  IconButton,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { theme as customTheme } from "../../../styles/theme";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import * as yup from "yup";
import { getServicosVenda } from "../../../hooks/vendas/useServicoVenda";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../../components/Table";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { api } from "../../../services/apiClient";
import { Pagination } from "../../../components/Pagination";
import { InputCurrency } from "../../../components/InputCurrency";
import { parseCookies } from "nookies";
import axios from "axios";

type FormData = {
  servico: string;
  valorServico: string;
  outrasDespesas: string;
  desconto: string;
  valorTotal: string;
};

const produtoVendaFormSchema = yup.object().shape({
  servico: yup.string(),
  valorServico: yup.string(),
  outrasDespesas: yup.string(),
  desconto: yup.string(),
  valorTotal: yup.string(),
});

export default function ServicoVenda({
  statusVenda,
  handleValorVenda,
  isLoading,
  handleLoad,
}) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [stateServico, setStateServico] = useState("");
  const [valorServico, setValorServico] = useState(0);
  const [outrasDespesas, setOutrasDespesas] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [addServico, setAddServico] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o serviço",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const [selectedServico, setSelectedServico] = useState({
    id: 0,
    valorTotal: 0,
    servico: { id: 0, nome: "" },
  });

  const [data, setData] = useState({
    servicosVenda: [
      {
        id: 0,
        valorServico: 0,
        outrasDespesas: 0,
        desconto: 0,
        valorTotal: 0,
        servico: { id: 0, nome: "" },
      },
    ],
    totalCount: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(produtoVendaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function fetchData() {
      const result: any = await getServicosVenda(page, null, vendaId);
      setData(result);
    }
    fetchData();
  }, [refreshKey]);

  async function callApi(value) {
    const { ["meiup.token"]: token } = parseCookies();

    const responseServicos: any = await axios.get(
      `http://localhost:8000/api/v1/servicos`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10, nome: value },
      }
    );

    const data = responseServicos.data.found.servicos.map((e) => {
      return {
        value: String(e.id),
        label: e.nome,
        valor: e.valor,
      };
    });

    return data;
  }

  const adicionarServico: SubmitHandler<FormData> = async (values) => {
    handleLoad(true);

    if (!selectData.value) {
      setAddServico(false);
      handleLoad(false);
      return false;
    }

    if (selectData.value && !valorServico) {
      handleLoad(false);
      return false;
    }

    if (!valorTotal) {
      toast({
        title: "Informar valor do serviço!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      handleLoad(false);
      return;
    }

    if (selectData.value) {
      const params = {
        servico: selectData.value,
        valorServico: valorServico / 100,
        outrasDespesas: outrasDespesas / 100,
        desconto: desconto / 100,
        valorTotal: valorTotal / 100,
      };

      const result = await api.post(`/vendas/servicosVenda/${vendaId}`, params);

      if (!result.data?.servicoVenda) {
        toast({
          title: "Serviço atualizado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Serviço adicionado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }

      handleValorVenda(result.data?.valorVenda);

      resetInputs();
      setRefreshKey((oldKey) => oldKey + 1);
    }

    handleLoad(false);
  };

  const resetInputs = () => {
    setselectData(null);
    setValorServico(0);
    setOutrasDespesas(0);
    setDesconto(0);
    setValorTotal(0);
  };

  const handleEditServico = (servicoVenda) => {
    const servico: any = [servicoVenda.servico].map((p) => {
      return { value: String(p.id), label: p.nome };
    })[0];
    setselectData(servico);
    setValorServico(servicoVenda.valorServico * 100);
    setOutrasDespesas(servicoVenda.outrasDespesas * 100);
    setDesconto(servicoVenda.desconto * 100);
    setValorTotal(servicoVenda.valorTotal * 100);
  };

  async function excluirServico(servicoVenda) {
    handleLoad(true);
    try {
      onClose();
      const result = await api.delete(`/vendas/servicosVenda/${vendaId}`, {
        data: {
          servico: servicoVenda.servico.id,
          servicoVenda: servicoVenda.id,
        },
      });

      toast({
        title: "Serviço removido com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      handleValorVenda(result.data?.valorVenda);

      setRefreshKey((oldKey) => oldKey - 1);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    handleLoad(false);
  }

  const handleServico = (servico) => {
    setselectData(servico);
    setValorServico((servico.valor ? servico.valor : 0) * 100);
    setOutrasDespesas(0);
    setDesconto(0);
    setValorTotal(0);
    setAddServico(true);
    calculaTotal();
  };

  const calculaTotal = () => {
    if (valorServico) {
      let total = valorServico ? valorServico / 100 : 0;
      total += outrasDespesas ? outrasDespesas / 100 : 0;
      total -= desconto ? desconto / 100 : 0;

      setValorTotal(total * 100);

      return;
    }
  };

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <VStack align="left" spacing="4">
            <Text fontWeight="bold">Serviço *</Text>
            <Skeleton isLoaded={!isLoading}>
              <AsyncSelect
                isDisabled={statusVenda !== 0}
                id="servico"
                {...register("servico")}
                cacheOptions
                loadOptions={callApi}
                onChange={handleServico}
                value={selectData}
                defaultOptions
                loadingMessage={() => "Carregando..."}
                noOptionsMessage={() => "Nenhum serviço encontrado"}
              />
            </Skeleton>
            {!addServico && (
              <Text color="red" fontSize="14px">
                Serviço obrigatório
              </Text>
            )}{" "}
          </VStack>
          <Stack>
            <InputCurrency
              id="valorServico"
              isDisabled={statusVenda !== 0}
              isLoading={isLoading}
              name="valorServico"
              label="Valor serviço *"
              {...register("valorServico")}
              value={valorServico}
              onBlur={calculaTotal}
              onValueChange={(v) => {
                setValorServico(v.floatValue);
              }}
            ></InputCurrency>
            {stateServico && !valorServico && (
              <Text color="red" fontSize="14px">
                Valor serviço obrigatório
              </Text>
            )}{" "}
          </Stack>
        </SimpleGrid>
      </VStack>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <InputCurrency
            id="outrasDespesasServicos"
            isDisabled={statusVenda !== 0}
            isLoading={isLoading}
            name="outrasDespesas"
            label="Outras despesas"
            {...register("outrasDespesas")}
            value={outrasDespesas}
            onBlur={calculaTotal}
            onValueChange={(v) => {
              setOutrasDespesas(v.floatValue);
            }}
          ></InputCurrency>
          <InputCurrency
            id="descontoServicos"
            isDisabled={statusVenda !== 0}
            isLoading={isLoading}
            name="desconto"
            label="Desconto"
            error={errors.desconto}
            {...register("desconto")}
            value={desconto}
            onBlur={calculaTotal}
            onValueChange={(v) => {
              setDesconto(v.floatValue);
            }}
          ></InputCurrency>
        </SimpleGrid>
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <InputCurrency
            id="valorTotalServicos"
            isDisabled={statusVenda !== 0}
            isLoading={isLoading}
            name="valorTotal"
            label="Total *"
            {...register("valorTotal")}
            value={valorTotal}
            onValueChange={(v) => {
              setValorTotal(v.floatValue);
            }}
          ></InputCurrency>
          <Box></Box>
        </SimpleGrid>
        {statusVenda === 0 && (
          <Box alignSelf="flex-end">
            <HStack>
              <Button
                data-cy="adicionar-servico"
                width="120px"
                fontSize="14px"
                type="submit"
                color="white"
                backgroundColor="yellow.500"
                onClick={handleSubmit(adicionarServico)}
              >
                ADICIONAR
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="8">
        Serviços adicionados na venda
      </Text>
      {data.servicosVenda.length === 0 ? (
        <Flex justify="center">
          <Text>Nenhum serviço adicionado</Text>
        </Flex>
      ) : (
        <Box>
          <Table
            id="table-servicos"
            variant="striped"
            colorScheme="blackAlpha"
            size="md"
          >
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Valor serviço</Th>
                <Th>Outras despesas</Th>
                <Th>Desconto</Th>
                <Th>Valor total</Th>
                <Th width="8">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.servicosVenda.map((servicoVenda, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <Text>{servicoVenda.servico.nome}</Text>
                    </Td>
                    <Td>
                      <Text>{formatter.format(servicoVenda.valorServico)}</Text>
                    </Td>
                    <Td>
                      <Text>
                        {formatter.format(servicoVenda.outrasDespesas)}
                      </Text>
                    </Td>
                    <Td>
                      <Text>{formatter.format(servicoVenda.desconto)}</Text>
                    </Td>
                    <Td>
                      <Text>{formatter.format(servicoVenda.valorTotal)}</Text>
                    </Td>
                    <Td>
                      <HStack>
                        {statusVenda === 0 && (
                          <>
                            <IconButton
                              variant="outline"
                              color="blue.800"
                              aria-label="Editar serviço"
                              icon={<RiPencilLine />}
                              onClick={() => {
                                handleEditServico(servicoVenda);
                              }}
                            />
                            <IconButton
                              variant="outline"
                              color="red.800"
                              aria-label="Remover serviço"
                              icon={<RiDeleteBinLine />}
                              onClick={() => {
                                setSelectedServico(servicoVenda);
                                setIsOpen(true);
                              }}
                            />
                          </>
                        )}
                      </HStack>

                      <AlertDialogList
                        isOpen={isOpen}
                        cancelRef={cancelRef}
                        onClose={onClose}
                        header="Remover Serviço"
                        body="Tem certeza que deseja remover o serviço"
                        description={selectedServico.servico?.nome}
                        onClick={() => excluirServico(selectedServico)}
                      />
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
      )}
    </>
  );
}
