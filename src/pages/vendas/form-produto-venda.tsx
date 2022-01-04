import {
  Box,
  createStandaloneToast,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";
import {
  getProdutosVenda,
  useProdutosVenda,
} from "../../hooks/vendas/useProdutoVenda";
import { api } from "../../services/apiClient";
import { theme as customTheme } from "../../styles/theme";
const toast = createStandaloneToast({ theme: customTheme });

export default function FormProdutoVenda({
  handleEditProduto,
  reload = false,
}) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [page, setPage] = useState(1);
  let { data, isLoading, error } = useProdutosVenda(page, null, vendaId, {
    initialData: null,
  });
  const [value, setValue] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  useEffect(() => {
    if (reload) {
      reloadData();
    } else {
      setValue(data);
    }
  }, [reload]);

  async function reloadData() {
    const { produtosVenda }: any = await getProdutosVenda(page, null, vendaId);

    const data: any = {
      produtosVenda,
    };

    setValue(data);
  }

  async function excluirProduto(produtoVenda) {
    try {
      onClose();

      await api.delete(`/vendas/produtoVenda/${vendaId}`, {
        data: {
          produto: produtoVenda.produto,
          produtoVenda: produtoVenda.id,
        },
      });

      toast({
        title: "Produto removido com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      reloadData();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box>
      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Falha ao obter dados dos produtos.</Text>
        </Flex>
      ) : (
        <Box color="black">
          <Table colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th>Descrição</Th>
                <Th>Quantidade</Th>
                <Th>Valor</Th>
                <Th width="8"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {value?.produtosVenda.map((produtoVenda) => {
                return (
                  <Tr key={produtoVenda.id}>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">
                          {produtoVenda.produto?.descricao}
                        </Text>
                      </Box>
                    </Td>

                    <Td>
                      <Text>{produtoVenda.quantidade}</Text>
                    </Td>

                    <Td>
                      <Text>{produtoVenda.valorTotal}</Text>
                    </Td>

                    <Td>
                      <HStack>
                        {/* <Tooltip label="Editar produto da venda">
                          <IconButton
                            variant="outline"
                            color="blue.800"
                            aria-label="Editar venda"
                            icon={<RiPencilLine />}
                            onClick={() => {
                              handleEditProduto(produtoVenda);
                            }}
                          />
                        </Tooltip> */}
                        <Tooltip label="Excluir produto da venda">
                          <IconButton
                            variant="outline"
                            color="red.800"
                            aria-label="Excluir produto"
                            icon={<RiCloseCircleLine />}
                            onClick={() => {
                              setIsOpen(true);
                            }}
                          />
                        </Tooltip>
                      </HStack>

                      <AlertDialogList
                        isOpen={isOpen}
                        cancelRef={cancelRef}
                        onClose={onClose}
                        header="Excluir produto"
                        body="Tem certeza que deseja remover o produto"
                        description={produtoVenda.produto.descricao}
                        textButton1="Não"
                        textButton2="Sim"
                        handleDelete={() => excluirProduto(produtoVenda)}
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
        </Box>
      )}
    </Box>
  );
}
