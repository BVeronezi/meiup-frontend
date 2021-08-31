/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, SimpleGrid, Stack, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { ContainerPage } from "../../components/ContainerPage";
import { Headings } from "../../components/Heading";
import { Input } from "../../components/Input";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";

type FormData = {
    cnpj: string;
    razaoSocial: string;
    ie: number;
    telefone: number;
    celular: number;
    email: string;
    cep: number;
    endereco: string;
    estado: string;
    numero: string;
    bairro: string;
    cidade: string;
    complemento: string;
}

const empresaFormSchema = yup.object().shape({
    cnpj: yup.string().required('CNPJ obrigatório'),
    razaoSocial: yup.string().required('Razão social obrigatória'),
    cep: yup.string().required('CEP obrigatório'),
    endereco: yup.string().required('Endereço obrigatório')
})

export default function DadosGerais() {
    
    const { user } = useContext(AuthContext);

    const { register, handleSubmit, formState, setValue } = useForm({
        resolver: yupResolver(empresaFormSchema)
    });

    const { errors } = formState;

    useEffect(() => {
        async function findEmpresa() {
            const empresaId: any = user.empresa?.id
            const response: any = await api.get(`empresa/${empresaId}`)

            Object.entries(response.data.empresa).forEach(([key, value]) => {
                if (key !== 'endereco'){
                    setValue(key,value)
                }        
            });

            Object.entries(response.data.empresa.endereco).forEach(([key, value]) => {
                setValue(key,value)
            });
        }

        findEmpresa()

        focus()
    }, [])

    const handleDadosGerais: SubmitHandler<FormData> = async (values) => {

        const data = {
            cnpj: values.cnpj,
            razaoSocial: values.razaoSocial,
            ie: values.ie,
            telefone: values.telefone,
            celular: values.celular,
            email: values.email,
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
            const empresaId: any = user.empresa?.id
            await api.patch(`/empresa/${empresaId}`, {
                    ...data,
            })

        } catch (err) {
            console.log(err)
        } 
    }

    return (
        <ContainerPage title="Empresa" subtitle="Dados gerais">
            <Stack as="form" onSubmit={handleSubmit(handleDadosGerais)} flex='1'>
                <Headings title="Informações da empresa"/>
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
                                name="cnpj"
                                autoFocus={true}
                                label="CNPJ *:"
                                error={errors.cnpj}
                                {...register('cnpj')}
                                >                                
                            </Input>

                            <Input 
                                name="razaoSocial"
                                label="Razão Social *:"
                                error={errors.razaoSocial}
                                {...register('razaoSocial')}
                            >                                
                            </Input>

                            <Input 
                                name="ie"
                                label="Inscrição Estadual:"
                                {...register('ie')}
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

                            <Input 
                                name="celular"
                                label="Celular:"
                                {...register('celular')}
                            >                                
                            </Input> 

                            <Input 
                                name="email"
                                type="email"
                                label="E-mail:"
                                {...register('email')}
                            >                                
                            </Input>
                        </SimpleGrid>
                    </VStack>
                </Box>
                <Box>
                <Box marginTop="2rem">                    
                    <Headings title="Endereço"/>
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
                <Flex justify="flex-end">
                        <Button 
                            mt="8"
                            width="200px"
                            type="submit" 
                            colorScheme="blue" 
                            isLoading={formState.isSubmitting}
                        >
                            SALVAR
                        </Button>
                    </Flex>
            </Stack> 
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {    
    return {
        props: {}
    }
})