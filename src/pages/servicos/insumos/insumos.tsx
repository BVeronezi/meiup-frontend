import {
  Box,
  Button,
  createStandaloneToast,
  Divider,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import AsyncSelect from "react-select/async";
import * as yup from "yup";
import { Input } from "../../../components/Input";
import { Pagination } from "../../../components/Pagination";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../../components/Table";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { getProdutoServico } from "../../../hooks/servicos/useProdutoServico";
import { api } from "../../../services/apiClient";
import { theme as customTheme } from "../../../styles/theme";

type FormData = {
  produto: string;
  quantidade: string;
};

const insumoFormSchema = yup.object().shape({
  produto: yup.string(),
  quantidade: yup.string().required("Quantidade obrigatória"),
});

export default function Insumos({ handleLoad }) {
  const router = useRouter();
  const servicoId: any = Object.keys(router.query)[0];
  const [page, setPage] = useState(1);
  const [addProduto, setAddProduto] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(insumoFormSchema),
  });

  const { errors } = formState;

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o produto",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  const [selectedProduto, setSelectedProduto] = useState({
    id: 0,
    quantidade: 0,
    produto: { id: 0, descricao: "" },
  });

  const [data, setData] = useState({
    produtosServico: [
      {
        id: 0,
        quantidade: 0,
        servico: { id: 0 },
        produto: { id: 0, descricao: "" },
      },
    ],
    totalCount: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const result: any = await getProdutoServico(page, servicoId);
      setData(result);
    }
    fetchData();
  }, [servicoId, page, refreshKey]);

  async function callApi(value) {
    const responseProdutos: any = await api.get(`/produtos`, {
      params: { limit: 10, descricao: value },
    });

    const data = responseProdutos.data.found.produtos.map((e) => {
      return {
        value: String(e.id),
        label: e.descricao,
      };
    });

    return data;
  }

  const handleEditProdutoServico = (produtoServico) => {
    const produto: any = [produtoServico.produto].map((p) => {
      return { value: String(p.id), label: p.descricao };
    })[0];
    setselectData(produto);
    setValue("quantidade", produtoServico.quantidade);
  };

  const handleProduto = (produto) => {
    setselectData(produto);
  };

  const adicionarInsumo: SubmitHandler<FormData> = async (values) => {
    handleLoad(true);
    if (!selectData.value) {
      setAddProduto(false);
    }

    if (selectData.value) {
      const params = {
        produto: selectData.value,
        quantidade: getValues("quantidade"),
      };

      const result = await api.post(
        `/servicos/produtosServico/${servicoId}`,
        params
      );

      if (!result.data?.produtoServico) {
        toast({
          title: "Insumo atualizado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Insumo adicionado com sucesso!",
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
    setValue("quantidade", null);
  };

  async function excluirInsumo(produtoServico) {
    handleLoad(true);
    try {
      onClose();
      await api.delete(`/servicos/produtosServico/${servicoId}`, {
        data: {
          produtoServico: produtoServico.id,
          produto: produtoServico.produto.id,
        },
      });

      toast({
        title: "Insumo removido com sucesso!",
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
            <Text fontWeight="bold">Produto</Text>
            <AsyncSelect
              id="produto"
              {...register("produto")}
              cacheOptions
              loadOptions={callApi}
              onChange={handleProduto}
              value={selectData}
              defaultOptions
              loadingMessage={() => "Carregando..."}
              noOptionsMessage={() => "Nenhum produto encontrado"}
            />
            {!addProduto && (
              <Text color="red" fontSize="14px">
                Produto obrigatório
              </Text>
            )}{" "}
          </VStack>
          {selectData?.value ? (
            <Input
              name="quantidade"
              label="Quantidade *"
              error={errors.quantidade}
              {...register("quantidade")}
            ></Input>
          ) : (
            ""
          )}
        </SimpleGrid>
        <Box alignSelf="flex-end">
          <HStack>
            <Button
              data-cy="adicionar"
              width="120px"
              fontSize="14px"
              type="submit"
              color="white"
              backgroundColor="yellow.500"
              onClick={handleSubmit(adicionarInsumo)}
            >
              ADICIONAR
            </Button>
          </HStack>
        </Box>
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="8">
        Insumos adicionados no serviço
      </Text>
      <Table
        id="table-insumos"
        variant="striped"
        colorScheme="blackAlpha"
        size="md"
      >
        <Thead>
          <Tr>
            <Th>Produto</Th>
            <Th>Quantidade</Th>
            <Th width="8">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.produtosServico.map((produtoServico, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Text>{produtoServico.produto.descricao}</Text>
                </Td>
                <Td>
                  <Text>{produtoServico.quantidade}</Text>
                </Td>
                <Td>
                  <HStack>
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Editar produto"
                      icon={<RiPencilLine />}
                      onClick={() => {
                        handleEditProdutoServico(produtoServico);
                      }}
                    />
                    <IconButton
                      variant="outline"
                      color="red.800"
                      aria-label="Remover produto"
                      icon={<RiDeleteBinLine />}
                      onClick={() => {
                        setSelectedProduto(produtoServico);
                        setIsOpen(true);
                      }}
                    />
                  </HStack>

                  <AlertDialogList
                    isOpen={isOpen}
                    cancelRef={cancelRef}
                    onClose={onClose}
                    header="Remover Insumo"
                    body="Tem certeza que deseja remover o insumo"
                    description={selectedProduto.produto?.descricao}
                    onClick={() => excluirInsumo(selectedProduto)}
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
