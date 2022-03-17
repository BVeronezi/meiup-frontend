import {
  Box,
  Button,
  createStandaloneToast,
  Divider,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  toast,
  VStack,
} from "@chakra-ui/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { theme as customTheme } from "../../../styles/theme";
import { SubmitHandler, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../services/apiClient";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../../components/Table";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { Pagination } from "../../../components/Pagination";
import { InputCurrency } from "../../../components/InputCurrency";
import { getServicoPromocao } from "../../../hooks/promocao/useServicoPromocao";

type FormData = {
  servico: string;
  precoPromocional: string;
};

const servicoFormSchema = yup.object().shape({
  servico: yup.string(),
  precoPromocional: yup.string(),
});

export default function ServicosPromocao({ handleLoad }) {
  const router = useRouter();
  const promocaoId: any = Object.keys(router.query)[0];
  const [page, setPage] = useState(1);
  const [addServico, setAddServico] = useState(true);
  const [precoPromocional, setPrecoPromocional] = useState(0);
  const toast = createStandaloneToast({ theme: customTheme });

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(servicoFormSchema),
  });

  const { errors } = formState;

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o serviço",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  const [selectedServico, setSelectedServico] = useState({
    id: 0,
    precoPromocional: 0,
    servico: { id: 0, nome: "" },
  });

  const [data, setData] = useState({
    servicosPromocao: [
      {
        id: 0,
        precoPromocional: 0,
        servico: { id: 0, nome: "" },
      },
    ],
    totalCount: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const result: any = await getServicoPromocao(page, promocaoId);
      setData(result);
    }
    fetchData();
  }, [page, promocaoId, refreshKey]);

  async function callApi(value) {
    const responseServicos: any = await api.get(`/servicos`, {
      params: { limit: 10, descricao: value },
    });

    const data = responseServicos.data.found.servicos.map((e) => {
      return {
        value: String(e.id),
        label: e.nome,
      };
    });

    return data;
  }

  const handleEditServicoPromocao = (servicoPromocao) => {
    const servico: any = [servicoPromocao.servico].map((p) => {
      return { value: String(p.id), label: p.nome };
    })[0];
    setselectData(servico);
    setPrecoPromocional(servicoPromocao.precoPromocional * 100);
  };

  const handleServico = (servico) => {
    setselectData(servico);
  };

  const adicionarServicoPromocao: SubmitHandler<FormData> = async (values) => {
    handleLoad(true);
    if (!selectData.value) {
      setAddServico(false);
    }

    if (selectData.value) {
      const params = {
        servico: selectData.value,
        precoPromocional: precoPromocional / 100,
      };

      const result = await api.post(`/promocoes/servico/${promocaoId}`, params);

      if (!result.data?.servicoPromocao) {
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

      handleLoad(false);
      resetInputs();
      setRefreshKey((oldKey) => oldKey + 1);
    }
  };

  const resetInputs = () => {
    setselectData(null);
    setPrecoPromocional(null);
  };

  async function excluirServico(servicoPromocao) {
    handleLoad(true);
    try {
      onClose();
      await api.delete(`/promocoes/servico/${promocaoId}`, {
        data: {
          servicoPromocao: servicoPromocao.id,
          servico: servicoPromocao.servico.id,
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
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    handleLoad(false);
  }

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <VStack align="left" spacing="4">
            <Text fontWeight="bold">Serviço</Text>
            <AsyncSelect
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
            {!addServico && (
              <Text color="red" fontSize="14px">
                Serviço obrigatório
              </Text>
            )}{" "}
          </VStack>
          {selectData?.value ? (
            <InputCurrency
              id="precoPromocional"
              name="precoPromocional"
              label="Valor promocional *"
              error={errors.precoPromocional}
              {...register("precoPromocional")}
              value={precoPromocional}
              onValueChange={(v) => {
                setPrecoPromocional(v.floatValue);
              }}
            ></InputCurrency>
          ) : (
            ""
          )}
        </SimpleGrid>
        <Box alignSelf="flex-end">
          <HStack>
            <Button
              data-cy="adicionar-servico"
              width="120px"
              fontSize="14px"
              type="submit"
              color="white"
              backgroundColor="yellow.500"
              onClick={handleSubmit(adicionarServicoPromocao)}
            >
              ADICIONAR
            </Button>
          </HStack>
        </Box>
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="8">
        Serviços adicionados na promoção
      </Text>
      <Table
        id="table-servicos-promocao"
        variant="striped"
        colorScheme="blackAlpha"
        size="md"
      >
        <Thead>
          <Tr>
            <Th>Serviço</Th>
            <Th>Valor promocional</Th>
            <Th width="8">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.servicosPromocao.map((servicoPromocao, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Text>{servicoPromocao.servico.nome}</Text>
                </Td>
                <Td>
                  <Text>{servicoPromocao.precoPromocional}</Text>
                </Td>
                <Td>
                  <HStack>
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Editar serviço"
                      icon={<RiPencilLine />}
                      onClick={() => {
                        handleEditServicoPromocao(servicoPromocao);
                      }}
                    />
                    <IconButton
                      variant="outline"
                      color="red.800"
                      aria-label="Remover serviço"
                      icon={<RiDeleteBinLine />}
                      onClick={() => {
                        setSelectedServico(servicoPromocao);
                        setIsOpen(true);
                      }}
                    />
                  </HStack>

                  <AlertDialogList
                    isOpen={isOpen}
                    cancelRef={cancelRef}
                    onClose={onClose}
                    header="Remover serviço"
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
