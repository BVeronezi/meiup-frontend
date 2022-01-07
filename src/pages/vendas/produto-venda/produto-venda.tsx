import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  createStandaloneToast,
  Divider,
  Flex,
  FormControl,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Select from "react-select";
import * as yup from "yup";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { theme as customTheme } from "../../../styles/theme";
import { api } from "../../../services/apiClient";
import { useRouter } from "next/router";
import { Input } from "../../../components/Input";
import { useProdutosVenda } from "../../../hooks/vendas/useProdutoVenda";
import {
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { Pagination } from "../../../components/Pagination";
import { BsBoxArrowUpRight, BsFillTrashFill } from "react-icons/bs";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../../components/Table";

const produtoVendaFormSchema = yup.object().shape({
  produto: yup.string(),
  quantidade: yup.number(),
  precoUnitario: yup.number(),
  outrasDespesas: yup.number(),
  desconto: yup.number(),
  valorTotal: yup.number(),
});

export default function ProdutoVenda({ produtos, produtosVenda }) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [stateProduto, setStateProduto] = useState("");
  const [reload, setReload] = useState(false);
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

  let { data, isLoading, error } = useProdutosVenda(page, null, vendaId, {
    initialData: produtosVenda,
  });

  const [value, setValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, formState, setValue, getValues } = useForm({
    resolver: yupResolver(produtoVendaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    const dados: any = data?.produtosVenda ?? data;

    const arrProdutosVenda = dados.map((p) => {
      return {
        id: p.id,
        descricao: p.produto.descricao,
        quantidade: p.quantidade,
        valor: p.valorTotal,
      };
    });

    setValues(arrProdutosVenda);
  }, []);

  async function excluirProduto(produtoVendaId) {
    try {
      onClose();

      console.log(JSON.parse(produtoVendaId));
      //console.log(`produto: ${event.produto.descricao}`);

      // await api.delete(`/vendas/produtoVenda/${vendaId}`, {
      //   data: {
      //     produto: produtoVenda.produto,
      //     produtoVenda: produtoVenda.id,
      //   },
      // });

      // toast({
      //   title: "Produto removido com sucesso!",
      //   status: "success",
      //   duration: 2000,
      //   isClosable: true,
      // });
    } catch (error) {
      console.log(error);
    }
  }

  const handleProduto = (produto) => {
    setValue("quantidade", getValues("quantidade"));
    setValue("precoUnitario", produto.precos?.precoVendaVarejo);
    setStateProduto(produto.value);
    calculaTotal();
  };

  const handleEditProduto = (produtoVenda) => {
    setStateProduto(String(produtoVenda.produto.id));
    setValue("precoUnitario", produtoVenda.precoUnitario);
    setValue("quantidade", produtoVenda.quantidade);
    setValue("outrasDespesas", produtoVenda.outrasDespesas);
    setValue("desconto", produtoVenda.desconto);
    setValue("valorTotal", produtoVenda.valorTotal);
  };

  async function adicionarProduto() {
    setReload(false);

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
          title: "Produto já adicionado na venda!",
          status: "info",
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

        setStateProduto("");
        setValue("quantidade", null);
        setValue("precoUnitario", null);
        setValue("outrasDespesas", null);
        setValue("desconto", null);
        setValue("valorTotal", null);
        setReload(true);
      }
    }
  }

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
            <Text>Produto: *</Text>
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
            {!stateProduto && (
              <Text color="red" fontSize="14px">
                Produto obrigatório
              </Text>
            )}{" "}
            *
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
              backgroundColor="yellow.600"
              onClick={(event) => {
                event.preventDefault();
                adicionarProduto();
              }}
            >
              ADICIONAR
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
          {value.map((produtoVenda, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Text>{produtoVenda.descricao}</Text>
                </Td>
                <Td>
                  <Text>{produtoVenda.quantidade}</Text>
                </Td>
                <Td>
                  <Text>{produtoVenda.valor}</Text>
                </Td>
                <Td>
                  <HStack>
                    <IconButton
                      variant="outline"
                      color="blue.800"
                      aria-label="Editar produto"
                      icon={<RiPencilLine />}
                      onClick={() => {
                        excluirProduto(JSON.stringify(produtoVenda));
                      }}
                    />
                    <IconButton
                      variant="outline"
                      color="red.800"
                      aria-label="Remover produto"
                      icon={<RiDeleteBinLine />}
                      onClick={() => {
                        excluirProduto(JSON.stringify(produtoVenda));
                      }}
                    />
                  </HStack>

                  {/* <AlertDialogList
                    isOpen={isOpen}
                    cancelRef={cancelRef}
                    onClose={onClose}
                    header="Remover Usuário"
                    body="Tem certeza que deseja remover o produto"
                    description={produtoVenda.descricao}
                    handleDelete={() =>
                      excluirProduto(JSON.stringify(produtoVenda))
                    }
                  /> */}
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
