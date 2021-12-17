import { Box, Button, createStandaloneToast, Flex, HStack, Icon, IconButton, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { ContainerPage } from "../../components/ContainerPage";
import { AuthContext } from "../../contexts/AuthContext";
import { Pesquisa } from "../../fragments/pesquisa";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";
import NextLink from "next/link";
import { queryClient } from "../../services/queryClient";
import { RiAddLine, RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import { theme as customTheme } from "../../styles/theme";
import { AlertDialogList } from "../../fragments/alert-dialog-list/alert-dialog-list";
interface ProdutosProps {
    produtos: Produto[];
    totalCount: number;
}

type Produto = {
    id: number;
    descricao: string;
    categoria: string;
    precoVarejo: number;
}

export default function Produtos() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const toast = createStandaloneToast({theme: customTheme})
    const [valuePesquisa, setValuePesquisa] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [error] = useState('');

    const [data, setData] = useState<ProdutosProps>();
    
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

    useEffect(() => {      
        fetchProdutos();    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    async function handleChange(event) {
        setValuePesquisa(event.target.value)

        if (event.target.value.length > 3) {
            fetchProdutos(event.target.value)
        } else {
            fetchProdutos()
        }
    }

    async function deleteProduto(produtoId: string) {

        try {
            onClose();

            await api.delete(`/produtos/${produtoId}`);
            
            toast({
                title: "Produto removido com sucesso!",
                status: "success",
                duration: 2000,
                isClosable: true,
            })  

            fetchProdutos()

        } catch (error) {
            console.log(error)
        }       
    }

    async function fetchProdutos(event?: string) {
        setIsLoading(true);

        const response: any = await api.get('/produtos', {
            params: {
                empresa: user.empresa.id,
                page,
                limit: 100,
            }
        });

        const produtos = response.data.found.produtos.map(produto => {
            return {
                id: produto.id,
                descricao: produto.descricao,
                categoria: produto.categoria?.nome ?? '-',
                precoVarejo: produto.precos?.precoVendaVarejo ?? '-'
            }
        })

        setData({
            produtos,
            totalCount: response.data.found.total
        })

        setIsLoading(false);
    }

    async function handlePrefetchProduto(produtoId: number) {
        await queryClient.prefetchQuery(['produto', produtoId], async () => {
            const response = await api.get(`/produtos/${produtoId}`);

            return response.data;
        }, {
            staleTime: 1000 * 60 * 10, // 10 minutes
            }
        )
    }

    return (
        <ContainerPage title="Produtos"> 
            <Box flex="1" borderRadius={8} boxShadow="base" p="8">
                    <Flex mb="8" justify="space-between" align="center">     
                    <Pesquisa valuePesquisa={valuePesquisa} handleChange={handleChange} />
                        <Box ml="4">
                        <NextLink href="/produtos/form" passHref>
                            <Button 
                            _hover={{
                                bg: 'blue.500'
                            }}
                            as="a"
                            size="sm" 
                            fontSize="sm" 
                            color="white"
                            backgroundColor="blue.800"
                            leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
                            >
                                Criar novo produto
                            </Button>
                        </NextLink>
                        </Box>
                      
                    </Flex>

                  { isLoading ? (
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
                                <Th>Produto</Th>  
                                <Th>Categoria</Th>     
                                <Th>Preço venda varejo</Th>                     
                                <Th width="8"></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        { data?.produtos.map(produto => {
                            return (
                                <Tr key={produto.id}>
                                    <Td> 
                                        <Box>
                                            <Link color="blue.900" onMouseEnter={() => handlePrefetchProduto(produto.id)}>
                                                <Text fontWeight="bold">{produto.descricao}</Text>
                                            </Link>
                                        </Box>
                                    </Td>

                                    <Td>
                                        <Text>{produto.categoria}</Text>
                                    </Td>

                                    <Td>
                                        <Text>{produto.precoVarejo}</Text>
                                    </Td>
                       
                                    <Td>                                        
                                        <HStack>
                                            <IconButton
                                                variant="outline"
                                                color="blue.800"
                                                aria-label="Editar produto"
                                                icon={<RiPencilLine />}
                                                onClick={() => {
                                                    router.push({pathname: '/produtos/form', query: String(produto.id)})
                                                }}
                                            />

                                            <IconButton
                                                variant="outline"
                                                color="red.800"
                                                aria-label="Excluir produto"
                                                icon={<RiDeleteBinLine />}
                                                onClick={() => {setIsOpen(true)}}
                                            />
                                    </HStack>

                                    <AlertDialogList 
                                        isOpen={isOpen} 
                                        cancelRef={cancelRef} 
                                        onClose={onClose} 
                                        header="Remover Produto" 
                                        body="Tem certeza que deseja remover o produto" 
                                        description={produto.descricao} 
                                        handleDelete={() => deleteProduto(String(produto.id))}
                                    />
                                </Td>
                            </Tr>
                            )
                        })}
                        </Tbody>
                </Table>

                <Pagination 
                    totalCountOfRegisters={data?.totalCount} 
                    currentPage={page}
                    onPageChange={setPage}
                />
                </Box>
                  ) }
            </Box>
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})