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
import { getProdutoPromocao } from "../../../hooks/promocao/useProdutoPromocao";
import { InputCurrency } from "../../../components/InputCurrency";

type FormData = {
  produto: string;
  precoPromocional: string;
};

const produtoFormSchema = yup.object().shape({
  produto: yup.string(),
  precoPromocional: yup.string(),
});

export default function ProdutosPromocao({ handleLoad }) {
  const router = useRouter();
  const promocaoId: any = Object.keys(router.query)[0];
  const [page, setPage] = useState(1);
  const [addProduto, setAddProduto] = useState(true);
  const [precoPromocional, setPrecoPromocional] = useState(0);
  const toast = createStandaloneToast({ theme: customTheme });

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(produtoFormSchema),
  });

  const { errors } = formState;

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o produto",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  const [selectedProduto, setSelectedProduto] = useState({
    id: 0,
    precoPromocional: 0,
    produto: { id: 0, descricao: "" },
  });

  const [data, setData] = useState({
    produtosPromocao: [
      {
        id: 0,
        precoPromocional: 0,
        produto: { id: 0, descricao: "" },
      },
    ],
    totalCount: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const result: any = await getProdutoPromocao(page, promocaoId);
      setData(result);
    }
    fetchData();
  }, [page, promocaoId]);

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

  const handleEditProdutoPromocao = (produtoPromocao) => {
    const produto: any = [produtoPromocao.produto].map((p) => {
      return { value: String(p.id), label: p.descricao };
    })[0];
    setselectData(produto);
    setPrecoPromocional(produtoPromocao.precoPromocional * 100);
  };

  const handleProduto = (produto) => {
    setselectData(produto);
  };

  const adicionarProdutoPromocao: SubmitHandler<FormData> = async (values) => {
    handleLoad(true);
    if (!selectData.value) {
      setAddProduto(false);
    }

    if (selectData.value) {
      const params = {
        produto: selectData.value,
        precoPromocional: precoPromocional / 100,
      };

      const result = await api.post(`/promocoes/produto/${promocaoId}`, params);

      if (!result.data?.produtoPromocao) {
        toast({
          title: "Produto atualizado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Produto adicionado com sucesso!",
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

  async function excluirProduto(produtoPromocao) {
    handleLoad(true);
    try {
      onClose();
      await api.delete(`/promocoes/produto/${promocaoId}`, {
        data: {
          produtoPromocao: produtoPromocao.id,
          produto: produtoPromocao.produto.id,
        },
      });

      toast({
        title: "Produto removido com sucesso!",
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
            <InputCurrency
              id="precoPromocional"
              name="precoPromocional"
              label="Preço promocional *"
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
              data-cy="adicionar"
              width="120px"
              fontSize="14px"
              type="submit"
              color="white"
              backgroundColor="yellow.500"
              onClick={handleSubmit(adicionarProdutoPromocao)}
            >
              ADICIONAR
            </Button>
          </HStack>
        </Box>
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="8">
        Produtos adicionados na promoção
      </Text>
      <Table
        id="table-produtos-promocao"
        variant="striped"
        colorScheme="blackAlpha"
        size="md"
      >
        <Thead>
          <Tr>
            <Th>Produto</Th>
            <Th>Preço promocional</Th>
            <Th width="8">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.produtosPromocao.map((produtoPromocao, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Text>{produtoPromocao.produto.descricao}</Text>
                </Td>
                <Td>
                  <Text>{produtoPromocao.precoPromocional}</Text>
                </Td>
                <Td>
                  <HStack>
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Editar produto"
                      icon={<RiPencilLine />}
                      onClick={() => {
                        handleEditProdutoPromocao(produtoPromocao);
                      }}
                    />
                    <IconButton
                      variant="outline"
                      color="red.800"
                      aria-label="Remover produto"
                      icon={<RiDeleteBinLine />}
                      onClick={() => {
                        setSelectedProduto(produtoPromocao);
                        setIsOpen(true);
                      }}
                    />
                  </HStack>

                  <AlertDialogList
                    isOpen={isOpen}
                    cancelRef={cancelRef}
                    onClose={onClose}
                    header="Remover produto"
                    body="Tem certeza que deseja remover o produto"
                    description={selectedProduto.produto?.descricao}
                    onClick={() => excluirProduto(selectedProduto)}
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
