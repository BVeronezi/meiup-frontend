/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, createStandaloneToast, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Icon, IconButton, InputGroup, InputRightElement, Select, SimpleGrid, Stack, Tooltip, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { ContainerPage } from "../../components/ContainerPage";
import { Headings } from "../../components/Heading";
import { Input } from "../../components/Input";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/apiClient";
import { theme as customTheme } from "../../styles/theme";
import { useRouter } from "next/router";
import { InfoOutlineIcon, ViewIcon } from "@chakra-ui/icons";
import { AuthContext } from "../../contexts/AuthContext";

type FormData = {
    nome: string;
    email: string;
    role: string;
    senha: string;
    telefone: number;
    celular: number;
    cep: number;
    endereco: string;
    estado: string;
    numero: string;
    bairro: string;
    cidade: string;
    complemento: string;
}

const usuarioFormSchema = yup.object().shape({
    nome: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    role: yup.string().required('Perfil obrigatório'),
    cep: yup.string().required('CEP obrigatório'),
    endereco: yup.string().required('Endereço obrigatório')
})

export default function FormUsuario() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const toast = createStandaloneToast({theme: customTheme})

    const { register, handleSubmit, formState, setValue } = useForm({
        resolver: yupResolver(usuarioFormSchema)
    });

    const { errors } = formState;

    useEffect(() => {
        async function findUsuario() {
            setIsLoading(false);
            const usuarioId: any = Object.keys(router.query)[0]
            const response: any = await api.get(`/usuario/${usuarioId}`)

            Object.entries(response.data.user).forEach(([key, value]) => {
                if (key !== 'endereco'){
                    setValue(key,value)
                }        
            });

            if (response.data.user.endereco) {
                Object.entries(response.data.user.endereco).forEach(([key, value]) => {
                    setValue(key,value)
                });
            }

            setIsLoading(true);
        }


        if (Object.keys(router.query)[0]) {
            findUsuario()
        } else {
            const senha = Math.random().toString(36).slice(-8);
            setValue("senha", senha)
        }
        
        focus()
    }, [])

    const handleClick = () => setShow(!show)

    const handleUsuario: SubmitHandler<FormData> = async (values) => {

        const data = {
            nome: values.nome,
            role: values.role,
            email: values.email,
            senha: values.senha,
            telefone: values.telefone,
            celular: values.celular,       
            empresa: user.empresa,
            endereco: {
                cep: values.cep,
                endereco: values.endereco,
                numero: values.numero,
                bairro: values.bairro,
                cidade: values.cidade,
                estado: values.estado,
                complemento: values.complemento,
            }
        }

        try {
            const usuarioId: any = Object.keys(router.query)[0]

            if (usuarioId) {
                await api.patch(`/usuario/${usuarioId}`, {
                    ...data,
                })
            } else {
                await api.post(`/usuario`, {
                    ...data,
                })
            }

            toast({
                title: "Dados salvos com sucesso!",
                status: "success",
                duration: 2000,
                isClosable: true,
            })   

            router.back();

        } catch (err) {
            console.log(err)
        } 
    }

    return (
        <ContainerPage title="Usuário" subtitle="Novo usuário">          
            <Stack as="form" onSubmit={handleSubmit(handleUsuario)} flex='1'>
                <Headings title="Dados básicos" isLoading={isLoading}/>
                <Box 
                    marginTop="10px"
                    boxShadow="base"
                    borderRadius={20} 
                    borderColor="gray.300"
                    p={["6", "8"]} 
                    >

                    <VStack spacing="8">                   
                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input 
                                name="nome"
                                autoFocus={true}
                                label="Nome *:"
                                error={errors.nome}
                                {...register('nome')}
                            >                                
                            </Input>

                            <Input 
                                name="email"
                                type="email"
                                label="E-mail *:"
                                error={errors.email}
                                {...register('email')}
                            >                                
                            </Input>

                            <Input 
                                name="celular"
                                label="Celular:"
                                {...register('celular')}
                            >                                
                            </Input> 

                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input 
                                name="telefone"
                                label="Telefone:"
                                {...register('telefone')}
                            >                                
                            </Input>

                            <Box>
                            <FormLabel htmlFor="perfil">Perfil *:</FormLabel>
                                <Select 
                                    {...register('role')}
                                    variant="flushed"
                                    error={errors.role}
                                    borderBottomColor="gray.400"
                                    focusBorderColor="yellow.500"
                                    size="lg"
                                >
                                    <option value="USER">Funcionário</option>
                                    <option value="ADMIN">Administrador</option>
                                </Select>
                            </Box>

                            { !Object.keys(router.query)[0] && (
                                <FormControl isInvalid={!!errors.senha}>
                                    <FormLabel htmlFor="senha">SENHA
                                            <Tooltip label="Senha gerada automaticamente para o primeiro acesso" fontSize="md">
                                                <Icon as={InfoOutlineIcon} size="10px" ml="2" />
                                            </Tooltip>  
                                    </FormLabel> 
                                    <InputGroup size="md">
                                        <Input
                                            variant="flushed" 
                                            isDisabled
                                            type={show ? "text" : "password"}
                                            {...register('senha')}
                                        />
                                        <InputRightElement width="2.5rem">
                                            <IconButton aria-label="Input Password" icon={<ViewIcon/>} size="sm" onClick={handleClick}/>
                                        </InputRightElement>
                                    </InputGroup>

                                    {!!errors.senha && (
                                        <FormErrorMessage>
                                            {errors.senha.message}
                                        </FormErrorMessage>
                                    )}   
                                </FormControl>
                            )}

                        </SimpleGrid>
              
                    </VStack>
                </Box>
                <Box>
                <Box marginTop="2rem">                    
                    <Headings title="Endereço" isLoading={isLoading}/>
                </Box>
                <Box 
                    marginTop="10px"
                    boxShadow="base"
                    borderRadius={20} 
                    p={["6", "8"]} >

                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input 
                                name="cep"
                                label="CEP *:"
                                error={errors.cep}
                                {...register('cep')}
                            >                                
                            </Input>

                            <Input 
                                name="endereco"
                                label="Endereço *:"
                                error={errors.endereco}
                                {...register('endereco')}
                            >                                
                            </Input>
                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input 
                                name="numero"
                                label="Número:"
                                {...register('numero')}
                            >                                
                            </Input>

                            <Input  
                                name="bairro"
                                label="Bairro:"
                                {...register('bairro')}
                            >                                
                            </Input>

                            <Input 
                                name="cidade"
                                label="Cidade:"
                                {...register('cidade')}
                            >                                
                            </Input>
                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input 
                                name="estado"
                                label="Estado:"
                                {...register('estado')}
                            >                                
                            </Input>

                            <Input 
                                name="complemento"
                                label="Complemento:"
                                {...register('complemento')}
                            >                                
                            </Input>
                        </SimpleGrid>

                    </VStack>
                    </Box>
                </Box>
                <Box>
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="24px">
                            <Button 
                                width="200px"
                                type="submit" 
                                color="white"
                                backgroundColor="red.700"
                                onClick={(event) =>{ 
                                    event.preventDefault()
                                    router.back()}}
                            >
                                VOLTAR
                            </Button>
                            <Button 
                                width="200px"
                                type="submit" 
                                color="white"
                                backgroundColor="blue.500"
                                isLoading={formState.isSubmitting}
                            >
                                SALVAR
                            </Button>
                        </HStack>
                    </Flex>
                </Box>
            </Stack> 
           
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {    
    return {
        props: {}
    }
})