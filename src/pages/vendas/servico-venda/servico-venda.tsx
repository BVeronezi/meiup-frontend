import {
  createStandaloneToast,
  SimpleGrid,
  Stack,
  Text,
  Input as ChakraInput,
  VStack,
  Box,
  HStack,
  Button,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { theme as customTheme } from "../../../styles/theme";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import * as yup from "yup";
import { getServicosVenda } from "../../../hooks/vendas/useServicoVenda";
import NumberFormat from "react-number-format";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../../components/Table";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { api } from "../../../services/apiClient";
import { Pagination } from "../../../components/Pagination";

const produtoVendaFormSchema = yup.object().shape({
  servico: yup.string(),
  precoUnitario: yup.number(),
  outrasDespesas: yup.number(),
  desconto: yup.number(),
  valorTotal: yup.number(),
});

export default function ServicoVenda({ servicos }) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [stateServico, setStateServico] = useState("");
  const [idServicoVenda, setIdServicoVenda] = useState();
  const [stateValorServico, setStateValorServico] = useState(0);
  const [stateOutrasDespesas, setStateOutrasDespesas] = useState(0);
  const [stateValorTotal, setStateValorTotal] = useState(0);
  const [stateDesconto, setStateDesconto] = useState(0);
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

  const { register, formState, setValue, getValues } = useForm({
    resolver: yupResolver(produtoVendaFormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      const result: any = await getServicosVenda(page, null, vendaId);
      setData(result);
    }
    fetchData();
  }, [refreshKey]);

  async function adicionarServico() {
    if (!stateServico) {
      setAddServico(false);
    }

    if (stateServico) {
      const params = {
        servico: stateServico,
        valorServico: stateValorServico,
        outrasDespesas: stateOutrasDespesas,
        desconto: stateDesconto,
        valorTotal: stateValorTotal,
      };

      const result = await api.post(`/vendas/servicosVenda/${vendaId}`, params);

      if (!result.data?.servicosVenda) {
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
    }

    resetInputs();
    setRefreshKey((oldKey) => oldKey + 1);
  }

  const resetInputs = () => {
    setStateServico("");
    setStateValorServico(0);
    setStateOutrasDespesas(0);
    setStateDesconto(0);
    setStateValorTotal(0);
  };

  const handleEditServico = (servicoVenda) => {
    setStateServico(String(servicoVenda.servico.id));
    setStateValorServico(parseFloat(servicoVenda.valorServico));
    setStateOutrasDespesas(parseFloat(servicoVenda.outrasDespesas));
    setStateDesconto(parseFloat(servicoVenda.desconto));
    setStateValorTotal(parseFloat(servicoVenda.valorTotal));
    setIdServicoVenda(servicoVenda.id);
  };

  async function excluirServico(servicoVenda) {
    try {
      onClose();
      await api.delete(`/vendas/servicosVenda/${vendaId}`, {
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
      setRefreshKey((oldKey) => oldKey - 1);
    } catch (error) {
      console.log(error);
    }
  }

  const handleServico = (servico) => {
    setStateServico(servico.value);
    setStateValorServico(parseFloat(servico.valor) ?? 0);
    setAddServico(true);
    setStateValorTotal(parseFloat(servico.valor) ?? 0);
  };

  const handleOutrasDespesas = (value) => {
    setStateOutrasDespesas(value.floatValue);
    setStateValorTotal(stateValorTotal + (value.floatValue ?? 0));
  };

  const handleDesconto = (value) => {
    setStateDesconto(value.floatValue);
    console.log(stateValorTotal);
    setStateValorTotal(stateValorTotal - (value.floatValue ?? 0));
  };

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <VStack align="left" spacing="4">
            <Text fontWeight="bold">Serviço: *</Text>
            <Select
              id="servico"
              {...register("servico")}
              value={servicos.filter(function (option) {
                return option.value === stateServico;
              })}
              options={servicos}
              onChange={handleServico}
              placeholder="Selecione o serviço *"
            />
            {!addServico && (
              <Text color="red" fontSize="14px">
                Serviço obrigatório
              </Text>
            )}{" "}
          </VStack>
          <Stack spacing="4">
            <Text fontWeight="bold">Valor serviço:</Text>
            <NumberFormat
              isReadOnly={true}
              decimalScale={2}
              fixedDecimalScale={true}
              value={stateValorServico}
              onValueChange={(val) => setStateValorServico(val.floatValue)}
              customInput={ChakraInput}
              variant="flushed"
              borderColor="gray.400"
              thousandSeparator="."
              decimalSeparator=","
              prefix={"R$"}
            />
          </Stack>
        </SimpleGrid>
      </VStack>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <Stack spacing="4">
            <Text fontWeight="bold">Outras despesas:</Text>
            <NumberFormat
              decimalScale={2}
              fixedDecimalScale={true}
              value={stateOutrasDespesas}
              onValueChange={(val) => handleOutrasDespesas(val)}
              customInput={ChakraInput}
              variant="flushed"
              borderColor="gray.400"
              thousandSeparator="."
              decimalSeparator=","
              prefix={"R$"}
            />
          </Stack>
          <Stack spacing="4">
            <Text fontWeight="bold">Desconto:</Text>
            <NumberFormat
              decimalScale={2}
              fixedDecimalScale={true}
              value={stateDesconto}
              onValueChange={(val) => handleDesconto(val)}
              customInput={ChakraInput}
              variant="flushed"
              borderColor="gray.400"
              thousandSeparator="."
              decimalSeparator=","
              prefix={"R$"}
            />
          </Stack>
        </SimpleGrid>
      </VStack>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <Stack spacing="4">
            <Text fontWeight="bold">Valor total:</Text>
            <NumberFormat
              isReadOnly={true}
              decimalScale={2}
              fixedDecimalScale={true}
              value={stateValorTotal}
              onValueChange={(val) => setStateValorTotal(val.floatValue)}
              customInput={ChakraInput}
              variant="flushed"
              borderColor="gray.400"
              thousandSeparator="."
              decimalSeparator=","
              prefix={"R$"}
            />
          </Stack>
          <Box></Box>
        </SimpleGrid>
        <Box alignSelf="flex-end">
          <HStack>
            <Button
              width="120px"
              fontSize="14px"
              type="submit"
              color="white"
              backgroundColor="yellow.500"
              onClick={(event) => {
                event.preventDefault();
                adicionarServico();
              }}
            >
              {idServicoVenda ? "ATUALIZAR" : "ADICIONAR"}
            </Button>
          </HStack>
        </Box>
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="8">
        Serviços adicionados na venda
      </Text>
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
    </>
  );
}
