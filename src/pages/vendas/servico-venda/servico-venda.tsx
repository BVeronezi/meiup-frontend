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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { theme as customTheme } from "../../../styles/theme";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
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
import { Input } from "../../../components/Input";

type FormData = {
  servico: string;
  valorServico: string;
  outrasDespesas: string;
  desconto: string;
  valorTotal: string;
};

const produtoVendaFormSchema = yup.object().shape({
  servico: yup.string(),
  valorServico: yup.string().required("Valor do serviço obrigatório"),
  outrasDespesas: yup.string(),
  desconto: yup.string(),
  valorTotal: yup.string(),
});

export default function ServicoVenda({
  servicos,
  statusVenda,
  handleValorVenda,
  isLoading,
  handleLoad,
}) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [stateServico, setStateServico] = useState("");
  const [idServicoVenda, setIdServicoVenda] = useState();
  const [addServico, setAddServico] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

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

  const adicionarServico: SubmitHandler<FormData> = async (values) => {
    handleLoad(true);

    if (!stateServico) {
      setAddServico(false);
    }

    if (stateServico) {
      const params = {
        servico: stateServico,
        valorServico: values.valorServico,
        outrasDespesas: values.outrasDespesas,
        desconto: values.desconto,
        valorTotal: values.valorTotal,
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
    }

    resetInputs();
    setRefreshKey((oldKey) => oldKey + 1);
    handleLoad(false);
  };

  const resetInputs = () => {
    setStateServico("");
    setValue("valorServico", "");
    setValue("outrasDespesas", "");
    setValue("desconto", "");
    setValue("valorTotal", "");
  };

  const handleEditServico = (servicoVenda) => {
    setStateServico(String(servicoVenda.servico.id));
    setValue("valorServico", servicoVenda.valorServico);
    setValue("outrasDespesas", servicoVenda.outrasDespesas);
    setValue("desconto", servicoVenda.desconto);
    setValue("valorTotal", servicoVenda.valorTotal);
    setIdServicoVenda(servicoVenda.id);
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
    setStateServico(servico.value);
    setValue("valorServico", servico.valor);
    setValue("outrasDespesas", "");
    setValue("desconto", "");
    setAddServico(true);
    calculaTotal();
  };

  const calculaTotal = () => {
    const valorServico = getValues("valorServico");
    const outrasDespesas = getValues("outrasDespesas");
    const desconto = getValues("desconto");

    if (valorServico) {
      let total = valorServico ? parseFloat(valorServico) : 0;
      total += outrasDespesas ? parseFloat(outrasDespesas) : 0;
      total -= desconto ? parseFloat(desconto) : 0;

      setValue("valorTotal", total);
    }
  };

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <VStack align="left" spacing="4">
            <Text fontWeight="bold">Serviço *</Text>
            <Skeleton isLoaded={!isLoading}>
              <Select
                isDisabled={statusVenda !== 0}
                id="servico"
                {...register("servico")}
                value={servicos.filter(function (option) {
                  return option.value === stateServico;
                })}
                options={servicos}
                onChange={handleServico}
                placeholder="Selecione o serviço *"
              />
            </Skeleton>
            {!addServico && (
              <Text color="red" fontSize="14px">
                Serviço obrigatório
              </Text>
            )}{" "}
          </VStack>
          <Input
            isLoading={isLoading}
            isDisabled={statusVenda !== 0}
            name="valorServico"
            label="Valor serviço *"
            error={errors.valorServico}
            {...register("valorServico")}
            onBlur={calculaTotal}
          ></Input>
        </SimpleGrid>
      </VStack>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <Input
            isLoading={isLoading}
            isDisabled={statusVenda !== 0}
            name="outrasDespesas"
            label="Outras despesas"
            error={errors.outrasDespesas}
            {...register("outrasDespesas")}
            onBlur={calculaTotal}
          ></Input>
          <Input
            isLoading={isLoading}
            isDisabled={statusVenda !== 0}
            name="desconto"
            label="Desconto"
            error={errors.desconto}
            {...register("desconto")}
            onBlur={calculaTotal}
          ></Input>
        </SimpleGrid>
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <Input
            isLoading={isLoading}
            isDisabled={statusVenda !== 0}
            name="valorTotal"
            label="Total"
            error={errors.valorTotal}
            {...register("valorTotal")}
          ></Input>
          <Box></Box>
        </SimpleGrid>
        {statusVenda === 0 && (
          <Box alignSelf="flex-end">
            <HStack>
              <Button
                width="120px"
                fontSize="14px"
                type="submit"
                color="white"
                backgroundColor="yellow.500"
                onClick={handleSubmit(adicionarServico)}
              >
                {idServicoVenda ? "ATUALIZAR" : "ADICIONAR"}
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
          <Table variant="striped" colorScheme="blackAlpha" size="md">
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
                      <Text>{servicoVenda.valorServico}</Text>
                    </Td>
                    <Td>
                      <Text>{servicoVenda.outrasDespesas}</Text>
                    </Td>
                    <Td>
                      <Text>{servicoVenda.desconto}</Text>
                    </Td>
                    <Td>
                      <Text>{servicoVenda.valorTotal}</Text>
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
