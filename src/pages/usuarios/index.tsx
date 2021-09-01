import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Flex, Icon, IconButton, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { ContainerPage } from "../../components/ContainerPage";
import { Headings } from "../../components/Heading";
import { Pagination } from "../../components/Pagination";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface UsuariosProps {
    users: User[];
    totalCount: number;
}

type User = {
    id: string;
    nome: string;
    email: string;
    createdAt: string;
}

export default function Usuarios() {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<UsuariosProps>();
    const [error, setError] = useState('');

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true
    });

    useEffect(() => {
        async function getListUsers() {
            const response: any = await api.get('/usuario', {
                params: {
                    page,
                    limit: 100,
                }
            });
        
            const users = response.data.found.users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: new Date(user.dataCriacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })
                }
            })

            setData({
                users: users,
                totalCount: 10
            })
        }

        getListUsers();
    
    }, [page])

   
    async function handlePrefetchUser(userId: string) {
        await queryClient.prefetchQuery(['usuario', userId], async () => {
            const response = await api.get(`usuario/${userId}`);

            return response.data;
        }, {
            staleTime: 1000 * 60 * 10, // 10 minutes
        }
        )
    }

    return (
        <ContainerPage title="Usuários"> 
                <Box flex="1" borderRadius={8} boxShadow="base" p="8">
                    <Flex mb="8" justify="space-between" align="center">
                    <Headings title="Usuários"/>
                    <NextLink href="/users/create" passHref>
                        <Button 
                        as="a" 
                        size="sm" 
                        fontSize="sm" 
                        color="white"
                        backgroundColor="blue.800"
                        leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
                        >
                            Criar novo usuário
                        </Button>
                    </NextLink>
                      
                    </Flex>

                  { isLoading ? (
                      <Flex justify="center"> 
                      <Spinner />
                      </Flex>
                  ) : error ? (
                    <Flex justify="center">
                        <Text>Falha ao obter dados dos usuários.</Text>
                    </Flex>
                  ) : (
                    <Box color="black">
                    <Table colorScheme="blackAlpha"> 
                        <Thead>
                            <Tr>
                                <Th px={["4", "4", "6"]} color="gray.300" width="8">
                                    <Checkbox colorScheme="blue"/>
                                </Th>
                                <Th>Usuário</Th>
                                { isWideVersion && <Th>Data de cadastro</Th>}                               
                                <Th width="8"></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        { data?.users.map(user => {
                            return (
                                <Tr key={user.id}>
                                    <Td px={["4", "4", "6"]}>
                                    <Checkbox colorScheme="blue"/>
                                    </Td>
                                    <Td> 
                                        <Box>
                                            <Link color="blue.900" onMouseEnter={() => handlePrefetchUser(user.id)}>
                                                <Text fontWeight="bold">{user.nome}</Text>
                                            </Link>
                                        
                                            <Text fontSize="sm">{user.email}</Text>
                                        </Box>
                                    </Td>
                                    { isWideVersion &&  <Td>
                                        {user.createdAt}
                                    </Td> }                              
                                    <Td>

                                    <IconButton
                                        variant="outline"
                                        colorScheme="blue"
                                        aria-label="Editar usuário"
                                        icon={<RiPencilLine />}
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
        props: {
        }
    }
})
