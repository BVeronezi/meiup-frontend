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
import { Input } from "../../../components/Input";
import * as yup from "yup";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { theme as customTheme } from "../../../styles/theme";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { getProdutoServico } from "../../../hooks/servicos/useProdutoServico";
import { api } from "../../../services/apiClient";
import { Table, Tbody, Td, Th, Thead, Tr } from "../../../components/Table";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { Pagination } from "../../../components/Pagination";

type FormData = {
  produto: string;
  quantidade: string;
};

const insumoFormSchema = yup.object().shape({
  produto: yup.string(),
  quantidade: yup.string().required("Quantidade obrigatória"),
});

export default function Insumos({ produtos }) {
  const router = useRouter();
  const servicoId: any = Object.keys(router.query)[0];
  const [page, setPage] = useState(1);
  const [stateProduto, setStateProduto] = useState("");
  const [addProduto, setAddProduto] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(insumoFormSchema),
  });

  const { errors } = formState;

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
    total: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const result: any = await getProdutoServico(page, null, servicoId);
      setData(result);
    }
    fetchData();
  }, [refreshKey]);

  const handleEditProdutoServico = (produtoServico) => {
    setStateProduto(String(produtoServico.produto.id));
    setValue("quantidade", produtoServico.quantidade);
  };

  const handleProduto = (produto) => {
    setStateProduto(produto.value);
  };

  const adicionarInsumo: SubmitHandler<FormData> = async (values) => {
    if (!stateProduto) {
      setAddProduto(false);
    }

    if (stateProduto) {
      const params = {
        produto: stateProduto,
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

      resetInputs();
      setRefreshKey((oldKey) => oldKey + 1);
    }
  };

  const resetInputs = () => {
    setStateProduto("");
    setValue("quantidade", null);
  };

  async function excluirInsumo(produtoServico) {
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
      console.log(error);
    }
  }

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
          <VStack align="left" spacing="4">
            <Text fontWeight="bold">Produto:</Text>
            <Select
              id="categoria"
              {...register("categoria")}
              value={produtos.result.filter(function (option) {
                return option.value === stateProduto;
              })}
              options={produtos.result}
              onChange={handleProduto}
              placeholder="Selecione o produto"
            />
            {!addProduto && (
              <Text color="red" fontSize="14px">
                Produto obrigatório
              </Text>
            )}{" "}
          </VStack>
          {stateProduto && (
            <Input
              name="quantidade"
              label="Quantidade: *"
              error={errors.quantidade}
              {...register("quantidade")}
            ></Input>
          )}
        </SimpleGrid>
        <Box alignSelf="flex-end">
          <HStack>
            <Button
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
      <Table variant="striped" colorScheme="blackAlpha" size="md">
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
        totalCountOfRegisters={data?.total}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  );
}
