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
import { RiDeleteBinLine } from "react-icons/ri";
import { AlertDialogList } from "../../../fragments/alert-dialog-list/alert-dialog-list";
import { Pagination } from "../../../components/Pagination";
import { getProdutoFornecedor } from "../../../hooks/produtos/useProdutosFornecedores";

type FormData = {
  fornecedor: string;
};

const fornecedorFormSchema = yup.object().shape({
  fornecedor: yup.string(),
});

export default function FornecedoresProduto({ handleLoad }) {
  const router = useRouter();
  const produtoId: any = Object.keys(router.query)[0];
  const [page, setPage] = useState(1);
  const [addFornecedor, setAddFornecedor] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(fornecedorFormSchema),
  });

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o fornecedor",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  const [selectedFornecedor, setSelectedFornecedor] = useState({
    id: 0,
    fornecedor: { nome: "" },
  });

  const [data, setData] = useState({
    produtoFornecedores: [
      {
        id: 0,
        fornecedor: { nome: "" },
      },
    ],
    totalCount: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const result: any = await getProdutoFornecedor(page, produtoId);
      setData(result);
    }
    fetchData();
  }, [page, produtoId, refreshKey]);

  async function callApi(value) {
    const responseFornecedores: any = await api.get(`/fornecedores`, {
      params: { limit: 10, nome: value },
    });

    const data = responseFornecedores.data.found.fornecedores.map((e) => {
      return {
        value: String(e.id),
        label: e.nome,
      };
    });

    return data;
  }

  const handleFornecedor = (fornecedor) => {
    setselectData(fornecedor);
  };

  const adicionarFornecedor: SubmitHandler<FormData> = async (values) => {
    handleLoad(true);
    if (!selectData.value) {
      setAddFornecedor(false);
    }

    if (selectData.value) {
      const params = {
        fornecedor: selectData.value,
        produto: produtoId,
      };

      const result = await api.post(
        `/produtos/fornecedor/${produtoId}`,
        params
      );

      if (!result.data?.produtoFornecedor) {
        toast({
          title: "Fornecedor atualizado com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Fornecedor adicionado com sucesso!",
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
  };

  async function excluirFornecedor(produtoFornecedor) {
    handleLoad(true);
    try {
      onClose();
      await api.delete(`/produtos/fornecedor/${produtoId}`, {
        data: {
          produtoFornecedor: produtoFornecedor.id,
          produto: produtoId,
        },
      });

      toast({
        title: "Fornecedor removido com sucesso!",
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
            <Text fontWeight="bold">Fornecedor</Text>
            <AsyncSelect
              id="fornecedor"
              {...register("fornecedor")}
              cacheOptions
              loadOptions={callApi}
              onChange={handleFornecedor}
              value={selectData}
              defaultOptions
              loadingMessage={() => "Carregando..."}
              noOptionsMessage={() => "Nenhum fornecedor encontrado"}
            />
            {!addFornecedor && (
              <Text color="red" fontSize="14px">
                Fornecedor obrigatório
              </Text>
            )}{" "}
          </VStack>
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
              onClick={handleSubmit(adicionarFornecedor)}
            >
              ADICIONAR
            </Button>
          </HStack>
        </Box>
      </VStack>
      <Divider mt="12" />
      <Text fontSize="20px" fontWeight="medium" mt="8" mb="8">
        Fornecedores do produto
      </Text>
      <Table
        id="table-fornecedores"
        variant="striped"
        colorScheme="blackAlpha"
        size="md"
      >
        <Thead>
          <Tr>
            <Th>Fornecedor</Th>
            <Th width="8">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.produtoFornecedores.map((produtoFornecedor, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Text>{produtoFornecedor.fornecedor?.nome}</Text>
                </Td>
                <Td>
                  <HStack>
                    <IconButton
                      variant="outline"
                      color="red.800"
                      aria-label="Remover fornecedor"
                      icon={<RiDeleteBinLine />}
                      onClick={() => {
                        setSelectedFornecedor(produtoFornecedor);
                        setIsOpen(true);
                      }}
                    />
                  </HStack>

                  <AlertDialogList
                    isOpen={isOpen}
                    cancelRef={cancelRef}
                    onClose={onClose}
                    header="Remover Forneceodr"
                    body="Tem certeza que deseja remover o fornecedor"
                    description={selectedFornecedor.fornecedor?.nome}
                    onClick={() => excluirFornecedor(selectedFornecedor)}
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
