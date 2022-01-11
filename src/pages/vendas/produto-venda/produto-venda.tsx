import * as React from "react";
import {
  Box,
  Button,
  createStandaloneToast,
  Divider,
  FormControl,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import Select from "react-select";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

const produtoVendaFormSchema = yup.object().shape({
  produto: yup.string(),
  quantidade: yup.number(),
  precoUnitario: yup.number(),
  outrasDespesas: yup.number(),
  desconto: yup.number(),
  valorTotal: yup.number(),
});

export default function ProdutoVenda({ produtos }) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [stateProduto, setStateProduto] = useState("");
  const [idProdutoVenda, setIdProdutoVenda] = useState();
  const [addProduto, setAddProduto] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

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

  const { register, formState, setValue, getValues } = useForm({
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

  async function excluirProduto(produtoVenda) {
    try {
      onClose();
      await api.delete(`/vendas/produtoVenda/${vendaId}`, {
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
      setRefreshKey((oldKey) => oldKey - 1);
    } catch (error) {
      console.log(error);
    }
  }

  const handleProduto = (produto) => {
    setValue("quantidade", getValues("quantidade"));
    setValue("precoUnitario", produto.precos?.precoVendaVarejo);
    setStateProduto(produto.value);
    setAddProduto(true);
    calculaTotal();
  };

  const handleEditProduto = (produtoVenda) => {
    setStateProduto(String(produtoVenda.produto.id));
    setValue("precoUnitario", produtoVenda.precoUnitario);
    setValue("quantidade", produtoVenda.quantidade);
    setValue("outrasDespesas", produtoVenda.outrasDespesas);
    setValue("desconto", produtoVenda.desconto);
    setValue("valorTotal", produtoVenda.valorTotal);
    setIdProdutoVenda(produtoVenda.id);
  };

  async function adicionarProduto() {
    if (!stateProduto) {
      setAddProduto(false);
    }

    if (stateProduto) {
      const params = {
        produto: stateProduto,
        quantidade: getValues("quantidade"),
        precoUnitario: getValues("precoUnitario"),
        outrasDespesas: getValues("outrasDespesas"),
        desconto: getValues("desconto"),
        valorTotal: getValues("valorTotal"),
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

      resetInputs();
      setRefreshKey((oldKey) => oldKey + 1);
    }
  }

  const resetInputs = () => {
    setStateProduto("");
    setValue("quantidade", null);
    setValue("precoUnitario", null);
    setValue("outrasDespesas", null);
    setValue("desconto", null);
    setValue("valorTotal", null);
  };

  const calculaTotal = () => {
    const quantidade = getValues("quantidade");
    const precoUnitario = getValues("precoUnitario");
    const outrasDespesas = getValues("outrasDespesas");
    const desconto = getValues("desconto");

    if (precoUnitario) {
      let total = Math.ceil(quantidade * precoUnitario);
      total += Math.ceil(outrasDespesas);
      total -= desconto;

      setValue("valorTotal", total);
    }
  };

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <VStack align="left" spacing="4">
            <Text fontWeight="bold">Produto: *</Text>
            <Select
              id="produto"
              {...register("produto")}
              value={produtos.filter(function (option) {
                return option.value === stateProduto;
              })}
              options={produtos}
              onChange={handleProduto}
              placeholder="Selecione o produto *"
            />
            {!addProduto && (
              <Text color="red" fontSize="14px">
                Produto obrigatório
              </Text>
            )}{" "}
          </VStack>
          <FormControl isInvalid={!!errors.quantidade}>
            <Input
              name="quantidade"
              label="Quantidade: *"
              error={errors.quantidade}
              {...register("quantidade")}
              onBlur={calculaTotal}
            ></Input>
          </FormControl>
        </SimpleGrid>
      </VStack>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <Input
            isReadOnly
            name="precoUnitario"
            label="Preço unitário: *"
            error={errors.precoUnitario}
            {...register("precoUnitario")}
          ></Input>
          <Input
            name="outrasDespesas"
            label="Outras despesas:"
            error={errors.outrasDespesas}
            {...register("outrasDespesas")}
            onBlur={calculaTotal}
          ></Input>
        </SimpleGrid>
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <Input
            name="desconto"
            label="Desconto:"
            error={errors.desconto}
            {...register("desconto")}
            onBlur={calculaTotal}
          ></Input>
          <Input
            isReadOnly
            name="total"
            label="Total: *"
            error={errors.valorTotal}
            {...register("valorTotal")}
          ></Input>
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
                adicionarProduto();
              }}
            >
              {idProdutoVenda ? "ATUALIZAR" : "ADICIONAR"}
            </Button>
          </HStack>
        </Box>
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="8">
        Produtos adicionados na venda
      </Text>
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
                  <Text>{produtoVenda.valorTotal}</Text>
                </Td>
                <Td>
                  <HStack>
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
    </>
  );
}
