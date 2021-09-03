import React, { useContext, useEffect, useState } from "react";
import { 
    Stack,
    Box, 
    Button, 
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    createStandaloneToast, 
    Flex, 
    HStack, 
    Icon, 
    IconButton, 
    Link, 
    Spinner, 
    Table, 
    Tbody, 
    Td, 
    Text, 
    Th, 
    Thead, 
    Tr, 
    useBreakpointValue, 
    Input as ChakraInput,
    InputGroup,
    InputLeftElement,
    Grid,
    GridItem
} from "@chakra-ui/react";
import NextLink from "next/link";
import { RiAddLine, RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { ContainerPage } from "../../components/ContainerPage";
import { Headings } from "../../components/Heading";
import { Pagination } from "../../components/Pagination";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { theme as customTheme } from "../../styles/theme";
import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";
interface UsuariosProps {
    users: User[];
    totalCount: number;
}

type User = {
    id: string;
    nome: string;
    perfil: Perfil;
    email: string;
    createdAt: string;
}

enum Perfil {
    'ADMIN' = 'Administrador',
    'USER' = 'Funcionário'
}

export default function Usuarios() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const toast = createStandaloneToast({theme: customTheme})

    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

    const [valuePesquisa, setValuePesquisa] = useState("")
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<UsuariosProps>();
    const [error, setError] = useState('');

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true
    });

    useEffect(() => {      
        fetchUsers();    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    async function deleteUser(userId: string) {

        try {
            onClose();

            await api.delete(`/usuario/${userId}`);
            
            toast({
                title: "Usuário removido com sucesso!",
                status: "success",
                duration: 2000,
                isClosable: true,
            })  

            fetchUsers()

        } catch (error) {
            console.log(error)
        }       
    }

    async function handleChange(event) {
        setValuePesquisa(event.target.value)

        if (event.target.value.length > 3) {
            fetchUsers(event.target.value)
        } else {
            fetchUsers()
        }
    }

    async function fetchUsers(event?: string) {
        setIsLoading(true);

        const response: any = await api.get('/usuario', {
            params: {
                nome: event,
                email: event,
                empresa: user.empresa.id,
                page,
                limit: 100,
            }
        });

        const users = response.data.found.users.map(user => {
            return {
                id: user.id,
                nome: user.nome,
                email: user.email,
                perfil: user.role,
                createdAt: new Date(user.dataCriacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        })

        setData({
            users: users,
            totalCount: response.data.found.total
        })

        setIsLoading(false);
    }
   
    async function handlePrefetchUser(userId: string) {
        await queryClient.prefetchQuery(['usuario', userId], async () => {
            const response = await api.get(`/usuario/${userId}`);

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
                        <InputGroup>
                                <InputLeftElement                                
                                pointerEvents="none"
                                // eslint-disable-next-line react/no-children-prop
                                children={<SearchIcon color="gray.300" />}
                                />
                                <ChakraInput value={valuePesquisa} size="sm" type="tel" placeholder="Pesquisar" onChange={handleChange}/>
                        </InputGroup>

                        <Box ml="4">
                        <NextLink href="/usuarios/form" passHref>
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
                                Criar novo usuário
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
                        <Text>Falha ao obter dados dos usuários.</Text>
                    </Flex>
                  ) : (
                    <Box color="black">
                    <Table colorScheme="blackAlpha"> 
                        <Thead>
                            <Tr>
                                <Th>Usuário</Th>
                                <Th>Perfil</Th>
                                { isWideVersion && <Th>Data de cadastro</Th>}                               
                                <Th width="8"></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        { data?.users.map(user => {
                            return (
                                <Tr key={user.id}>
                                    <Td> 
                                        <Box>
                                            <Link color="blue.900" onMouseEnter={() => handlePrefetchUser(user.id)}>
                                                <Text fontWeight="bold">{user.nome}</Text>
                                            </Link>
                                        
                                            <Text fontSize="sm">{user.email}</Text>
                                        </Box>
                                    </Td>

                                    <Td>
                                        <Text>{Perfil[user.perfil]}</Text>
                                    </Td>

                                    { isWideVersion &&  <Td>
                                        {user.createdAt}
                                    </Td> }                              
                                    <Td>
                                        
                                    
                                    <HStack>
                                        <IconButton
                                            variant="outline"
                                            color="blue.800"
                                            aria-label="Editar usuário"
                                            icon={<RiPencilLine />}
                                            onClick={() => {
                                                router.push({pathname: '/usuarios/form', query: user.id})
                                            }}
                                        />

                                        <IconButton
                                            variant="outline"
                                            color="red.800"
                                            aria-label="Excluir usuário"
                                            icon={<RiDeleteBinLine />}
                                            onClick={() => {setIsOpen(true)}}
                                        />
                                    </HStack>

                                    <AlertDialog
                                        isOpen={isOpen}
                                        leastDestructiveRef={cancelRef}
                                        onClose={onClose}
                                    >
                                    <AlertDialogOverlay>
                                    <AlertDialogContent color="black">
                                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                        Remover usuário
                                        </AlertDialogHeader>

                                        <AlertDialogBody>
                                        Tenm certeza que deseja remover o usuário {user.email} ? 
                                        </AlertDialogBody>

                                        <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onClose}>
                                            Cancelar
                                        </Button>
                                        <Button colorScheme="red" onClick={() => deleteUser(user.id)} ml={3}>
                                            Remover
                                        </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                    </AlertDialogOverlay>
                                </AlertDialog>

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
