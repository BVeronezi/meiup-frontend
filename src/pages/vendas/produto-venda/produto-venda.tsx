import * as React from "react";
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
import Select from "react-select";
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
  produtos,
  statusVenda,
  handleValorVenda,
}) {
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

  async function excluirProduto(produtoVenda) {
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
      console.log(error);
    }
  }

  const handleProduto = (produto) => {
    setValue("precoUnitario", produto.precos?.precoVendaVarejo);
    setValue("quantidade", "");
    setValue("outrasDespesas", "");
    setValue("desconto", "");
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

  const adicionarProduto: SubmitHandler<FormData> = async (values) => {
    if (!stateProduto) {
      setAddProduto(false);
    }

    if (stateProduto) {
      const params = {
        produto: stateProduto,
        quantidade: values.quantidade,
        precoUnitario: values.precoUnitario,
        outrasDespesas: values.outrasDespesas,
        desconto: values.desconto,
        valorTotal: values.valorTotal,
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
  };

  const resetInputs = () => {
    setStateProduto("");
    setValue("quantidade", "");
    setValue("precoUnitario", "");
    setValue("outrasDespesas", "");
    setValue("desconto", "");
    setValue("valorTotal", "");
  };

  const calculaTotal = () => {
    const quantidade = getValues("quantidade");
    const precoUnitario = getValues("precoUnitario");
    const outrasDespesas = getValues("outrasDespesas");
    const desconto = getValues("desconto");

    if (precoUnitario) {
      let total =
        (quantidade ? Number(quantidade) : 0) *
        (precoUnitario ? parseFloat(precoUnitario.replace(/,/g, ".")) : 0);
      total += outrasDespesas
        ? parseFloat(outrasDespesas.replace(/,/g, "."))
        : 0;
      total -= desconto ? parseFloat(desconto.replace(/,/g, ".")) : 0;

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
              isDisabled={statusVenda !== 0}
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
          <Input
            isDisabled={statusVenda !== 0}
            name="quantidade"
            label="Quantidade: *"
            error={errors.quantidade}
            {...register("quantidade")}
            onBlur={calculaTotal}
          ></Input>
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
            isDisabled={statusVenda !== 0}
            name="outrasDespesas"
            label="Outras despesas:"
            error={errors.outrasDespesas}
            {...register("outrasDespesas")}
            onBlur={calculaTotal}
          ></Input>
        </SimpleGrid>
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <Input
            isDisabled={statusVenda !== 0}
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
    </>
  );
}
