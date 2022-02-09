import * as React from "react";
import {
  Box,
  Button,
  createStandaloneToast,
  Divider,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { theme as customTheme } from "../../../styles/theme";
import { api } from "../../../services/apiClient";
import { useRouter } from "next/router";
import { Input } from "../../../components/Input";
import { getProdutosVenda } from "../../../hooks/vendas/useProdutoVenda";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { Pagination } from "../../../components/Pagination";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../../components/Table";
import { InputCurrency } from "../../../components/InputCurrency";
import axios from "axios";
import { parseCookies } from "nookies";

type FormData = {
  produto: string;
  quantidade: string;
  precoUnitario: string;
  outrasDespesas: string;
  desconto: string;
  valorTotal: string;
};

const produtoVendaFormSchema = yup.object().shape({
  produto: yup.string(),
  quantidade: yup.string().required("Quantidade obrigatória"),
  precoUnitario: yup.string(),
  outrasDespesas: yup.string(),
  desconto: yup.string(),
  valorTotal: yup.string(),
});

export default function ProdutoVenda({
  statusVenda,
  handleValorVenda,
  isLoading,
  handleLoad,
}) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [idProdutoVenda, setIdProdutoVenda] = useState();
  const [addProduto, setAddProduto] = useState(true);
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [outrasDespesas, setOutrasDespesas] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o produto",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const [selectedProduto, setSelectedProduto] = useState({
    id: 0,
    quantidade: 0,
    valorTotal: 0,
    produto: { id: 0, descricao: "" },
  });

  const [data, setData] = useState({
    produtosVenda: [
      {
        id: 0,
        quantidade: 0,
        valorTotal: 0,
        produto: { id: 0, descricao: "" },
      },
    ],
    total: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, formState, handleSubmit, setValue, getValues } = useForm({
    resolver: yupResolver(produtoVendaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function fetchData() {
      const result: any = await getProdutosVenda(page, null, vendaId);
      setData(result);
    }
    fetchData();
  }, [refreshKey]);

  async function callApi(value) {
    const { ["meiup.token"]: token } = parseCookies();

    const responseProdutos: any = await axios.get(
      `https://meiup-api.herokuapp.com/api/v1/produtos`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10, descricao: value },
      }
    );

    const data = responseProdutos.data.found.produtos.map((e) => {
      return {
        value: String(e.id),
        label: e.descricao,
        precos: e.precos,
      };
    });

    return data;
  }

  async function excluirProduto(produtoVenda) {
    handleLoad(true);

    try {
      onClose();
      const result = await api.delete(`/vendas/produtoVenda/${vendaId}`, {
        data: {
          produto: produtoVenda.produto.id,
          produtoVenda: produtoVenda.id,
        },
      });

      toast({
        title: "Produto removido com sucesso!",
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

  const handleProduto = (produto) => {
    setValue("quantidade", "");
    setPrecoUnitario(
      (produto.precos ? produto.precos.precoVendaVarejo : 0) * 100
    );
    setOutrasDespesas(0);
    setDesconto(0);
    setValorTotal(0);
    setIdProdutoVenda(null);
    setselectData(produto);
    setAddProduto(true);
    calculaTotal();
  };

  const handleEditProduto = (produtoVenda) => {
    const produto: any = [produtoVenda.produto].map((p) => {
      return { value: String(p.id), label: p.descricao };
    })[0];
    setselectData(produto);
    setValue("quantidade", produtoVenda.quantidade);
    setPrecoUnitario(produtoVenda.precoUnitario * 100);
    setOutrasDespesas(produtoVenda.outrasDespesas * 100);
    setDesconto(produtoVenda.desconto * 100);
    setValorTotal(produtoVenda.valorTotal * 100);
    setIdProdutoVenda(produtoVenda.id);
  };

  const adicionarProduto: SubmitHandler<FormData> = async (values) => {
    handleLoad(true);

    if (!selectData.value) {
      setAddProduto(false);
      handleLoad(false);
      return false;
    }

    if (selectData.value) {
      const params = {
        produto: selectData.value,
        quantidade: values.quantidade,
        precoUnitario: precoUnitario / 100,
        outrasDespesas: outrasDespesas / 100,
        desconto: desconto / 100,
        valorTotal: valorTotal / 100,
      };

      const result = await api.post(`/vendas/produtoVenda/${vendaId}`, params);

      if (!result.data?.produtoVenda) {
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

      handleValorVenda(result.data?.valorVenda);

      resetInputs();
      setRefreshKey((oldKey) => oldKey + 1);
    }

    handleLoad(false);
  };

  const resetInputs = () => {
    setselectData(null);
    setValue("quantidade", "");
    setPrecoUnitario(0);
    setOutrasDespesas(0);
    setDesconto(0);
    setValorTotal(0);
  };

  const calculaTotal = () => {
    const quantidade = getValues("quantidade");

    if (precoUnitario) {
      let total =
        (quantidade ? Number(quantidade) : 0) *
        (precoUnitario ? precoUnitario / 100 : 0);
      total += outrasDespesas ? outrasDespesas / 100 : 0;
      total -= desconto ? desconto / 100 : 0;

      setValorTotal(total * 100);
    }
  };

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <VStack align="left" spacing="4">
            <Text fontWeight="bold">Produto *</Text>
            <Skeleton isLoaded={!isLoading}>
              <AsyncSelect
                isDisabled={statusVenda !== 0}
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
            </Skeleton>
            {!addProduto && (
              <Text color="red" fontSize="14px">
                Produto obrigatório
              </Text>
            )}{" "}
          </VStack>
          <Input
            isLoading={isLoading}
            isDisabled={statusVenda !== 0}
            name="quantidade"
            label="Quantidade *"
            error={errors.quantidade}
            {...register("quantidade")}
            onBlur={calculaTotal}
          ></Input>
        </SimpleGrid>
      </VStack>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <InputCurrency
            isDisabled={true}
            isLoading={isLoading}
            name="precoUnitario"
            label="Preço unitário *"
            error={errors.precoUnitario}
            {...register("precoUnitario")}
            value={precoUnitario}
            onValueChange={(v) => {
              setPrecoUnitario(v.floatValue);
            }}
          ></InputCurrency>

          <InputCurrency
            isDisabled={statusVenda !== 0}
            isLoading={isLoading}
            name="outrasDespesas"
            label="Outras despesas"
            error={errors.outrasDespesas}
            {...register("outrasDespesas")}
            value={outrasDespesas}
            onBlur={calculaTotal}
            onValueChange={(v) => {
              setOutrasDespesas(v.floatValue);
            }}
          ></InputCurrency>
        </SimpleGrid>
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <InputCurrency
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

          <InputCurrency
            isDisabled={true}
            isLoading={isLoading}
            name="valorTotal"
            label="Total *"
            error={errors.valorTotal}
            {...register("valorTotal")}
            value={valorTotal}
            onValueChange={(v) => {
              setValorTotal(v.floatValue);
            }}
          ></InputCurrency>
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
                onClick={handleSubmit(adicionarProduto)}
              >
                {idProdutoVenda ? "ATUALIZAR" : "ADICIONAR"}
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="10">
        Produtos adicionados na venda
      </Text>
      {data.produtosVenda.length == 0 ? (
        <Flex justify="center">
          <Text>Nenhum produto adicionado</Text>
        </Flex>
      ) : (
        <Box>
          <Table variant="striped" colorScheme="blackAlpha" size="md">
            <Thead>
              <Tr>
                <Th>Descrição</Th>
                <Th>Quantidade</Th>
                <Th>Valor Total</Th>
                <Th width="8">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.produtosVenda.map((produtoVenda, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <Text>{produtoVenda.produto.descricao}</Text>
                    </Td>
                    <Td>
                      <Text>{produtoVenda.quantidade}</Text>
                    </Td>
                    <Td>
                      <Text>{formatter.format(produtoVenda.valorTotal)}</Text>
                    </Td>
                    <Td>
                      <HStack>
                        {statusVenda === 0 && (
                          <>
                            <IconButton
                              variant="outline"
                              color="blue.800"
                              aria-label="Editar produto"
                              icon={<RiPencilLine />}
                              onClick={() => {
                                handleEditProduto(produtoVenda);
                              }}
                            />
                            <IconButton
                              variant="outline"
                              color="red.800"
                              aria-label="Remover produto"
                              icon={<RiDeleteBinLine />}
                              onClick={() => {
                                setSelectedProduto(produtoVenda);
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
                        header="Remover Produto"
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
            totalCountOfRegisters={data?.total}
            currentPage={page}
            onPageChange={setPage}
          />
        </Box>
      )}
    </>
  );
}
