import { Box, Button, createStandaloneToast, Flex, HStack, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { theme as customTheme } from "../../styles/theme";
import * as yup from 'yup';
import Select from 'react-select';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require('@hookform/resolvers/yup')
import { ContainerPage } from "../../components/ContainerPage";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { Headings } from "../../components/Heading";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

type FormData = {
    descricao: string;
    tipoItem: number;
    unidade: number;
    categoria: number;
    estoque: number;
    estoqueMinimo: number;
    estoqueMaximo: number;
    precoVendaVarejo: number;
    precoVendaAtacado: number;
    precoCompra: number;
    margemLucro: number;
}

const produtoFormSchema = yup.object().shape({
    descricao: yup.string().required('Descrição obrigatória'),
    tipoItem: yup.number(),
    unidade: yup.number(),
    categoria: yup.number(),
    estoque: yup.number().required('Estoque obrigatório'),
    estoqueMinimo: yup.number(),
    estoqueMaximo: yup.number(),
    precoVendaVarejo: yup.number(),
    precoVendaAtacado:  yup.number(),
    precoCompra: yup.number(),
    margemLucro: yup.number(),
})


export default function FormProduto(optionsCategoria, props) {
  
    const [stateTipoItem, setStateTipoItem] = useState("");
    const [stateUnidade, setStateUnidade] = useState("");
    const [stateCategoria, setStateCategoria] = useState("");
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const toast = createStandaloneToast({theme: customTheme})

    const { register, handleSubmit, formState, setValue, getValues } = useForm({
        resolver: yupResolver(produtoFormSchema)
    });

    const { errors } = formState;

    const optionsTipoItem = [
        { value: "1", label: "Produto"},
        { value: "2", label: "Insumo"},
        { value: "3", label: "Kit"},
        { value: "4", label: "Brinde"}
    ]

    const optionsUnidade = [
        { value: "1", label: "Quilograma"},
        { value: "2", label: "Caixa"},
        { value: "3", label: "Fardo"}
    ]

    useEffect(() => {
        async function findProduto() {
            setIsLoading(false);

            const produtoId: any = Object.keys(router.query)[0]

            if (produtoId) {
                const response: any = await api.get(`/produtos/${produtoId}`)

                const { descricao, estoque, estoqueMinimo, estoqueMaximo, empresa, tipoItem, unidade} = response.data.produto;

                setValue('descricao', descricao);
                setValue('estoque', estoque);
                setValue('estoqueMinimo', estoqueMinimo);
                setValue('estoqueMaximo', estoqueMaximo);
                setValue('empresa', empresa?.id);

                setStateTipoItem(String(tipoItem));
                setStateUnidade(String(unidade));
                
                if (response.data.produto.precos) {
                    Object.entries(response.data.user.endereco).forEach(([key, value]) => {
                        setValue(key,value)
                    });
                }

                if (response.data.produto.categoria) {
                    const { id } = response.data.produto.categoria;
                    setStateCategoria(String(id))
                }
            }

            setIsLoading(true);
        }

        if (Object.keys(router.query)[0]) {
            findProduto()
        }
        
        focus()
    }, [])

    const handleTipoItem = (tipoItem) => {
        setStateTipoItem(tipoItem.value)
    }

    const handleUnidade = (unidade) => {
        setStateUnidade(unidade.value)
     }

     const handleCategoria = (categoria) => {
        setStateCategoria(categoria.value)
     }

    const handleProduto: SubmitHandler<FormData> = async (values) => {

        debugger;

        console.log('chegou aqui')

        const data = {
            descricao: values.descricao,
            tipoItem: values.tipoItem,
            unidade: values.unidade,
            categoria: values.categoria,
            estoque: values.estoque,
            estoqueMinimo: values.estoqueMinimo,       
            estoqueMaximo: values.estoqueMaximo,
            empresa: user.empresa,
            precos: {
                precoVendaVarejo: values.precoVendaVarejo,
                precoVendaAtacado: values.precoVendaAtacado,
                precoCompra: values.precoCompra,
                margemLucro: values.margemLucro,
            }
        }

        try {
            const produtoId: any = Object.keys(router.query)[0]

            debugger;

            if (produtoId) {
                await api.patch(`/produtos/${produtoId}`, {
                    ...data,
                })
            } else {
                await api.post(`/produtos`, {
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
        <ContainerPage title="Produto" subtitle="Novo Produto">
            <Stack as="form" onSubmit={handleSubmit(handleProduto)} flex='1'> 
                <Headings title="Dados básicos" isLoading={isLoading}/>
                    <Box               
                        marginTop="10px"
                        boxShadow="base"
                        borderRadius={20} 
                        borderColor="gray.300"
                        p={["6", "8"]} >
                        <VStack spacing="8">
                            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                                <Input 
                                    name="descricao"
                                    autoFocus={true}
                                    label="Descrição *:"
                                    error={errors.descricao}
                                    {...register('descricao')}
                                >    
                                </Input>    
                                <VStack align="left" spacing="4">
                                    <Text>Tipo Item:</Text>
                                    <Select {...props}
                                        {...register('tipoItem')}
                                        value={optionsTipoItem.filter(function(option) {
                                            return option.value === stateTipoItem;
                                        })}
                                        id="tipoItem"
                                        options={optionsTipoItem}
                                        onChange={value => handleTipoItem(value)}
                                        placeholder="Selecione o tipo do item">                                  
                                    </Select>
                                </VStack>
                            </SimpleGrid>
                            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                                <VStack align="left" spacing="4">
                                    <Text>Unidade:</Text>
                                    <Select {...props}
                                        {...register('unidade')}
                                        value={optionsUnidade.filter(function(option) {
                                            return option.value === stateUnidade;
                                        })}
                                        id="unidade"                                       
                                        options={optionsUnidade}
                                        onChange={handleUnidade}
                                        placeholder="Selecione a unidade">
                                    </Select>
                                </VStack>
                                <VStack align="left" spacing="4">
                                    <Text>Categoria:</Text>
                                    <Select {...props}
                                        id="categoria"
                                        {...register('categoria')}
                                        value={optionsCategoria.result.filter(function(option) {
                                            return option.value === stateCategoria;
                                        })}
                                        options={optionsCategoria.result}
                                        onChange={handleCategoria}
                                        placeholder="Selecione a categoria">
                                    </Select>
                                </VStack>
                            </SimpleGrid>
                        </VStack>
                    </Box>
                <Headings title="Estoque" isLoading={isLoading}/>
                    <Box               
                        marginTop="10px"
                        boxShadow="base"
                        borderRadius={20} 
                        borderColor="gray.300"
                        p={["6", "8"]} >
                        <VStack spacing="8">
                            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                                <Input 
                                    type="number"
                                    defaultValue={0}
                                    name="estoque"
                                    label="Estoque *:"
                                    error={errors.estoque}
                                    {...register('estoque')}
                                >    
                                </Input>    
                                <Input 
                                    type="number"
                                    defaultValue={0}
                                    name="estoqueMinimo"
                                    label="Estoque Mínimo:"
                                    error={errors.estoqueMinimo}
                                    {...register('estoqueMinimo')}
                                >    
                                </Input>
                                <Input 
                                    type="number"
                                    defaultValue={0}
                                    name="estoqueMaximo"
                                    label="Estoque Máximo:"
                                    error={errors.estoqueMaximo}
                                    {...register('estoqueMaximo')}
                                >    
                                </Input>
                            </SimpleGrid>
                        </VStack>
                    </Box>
                <Headings title="Preços" isLoading={isLoading}/>
                    <Box               
                        marginTop="10px"
                        boxShadow="base"
                        borderRadius={20} 
                        borderColor="gray.300"
                        p={["6", "8"]} >
                        <VStack spacing="8">
                            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                                <Input 
                                    type="number"
                                    name="precoVendaVarejo"
                                    defaultValue={0}
                                    label="Preço de venda varejo:"
                                    error={errors.precoVendaVarejo}
                                    {...register('precoVendaVarejo')}
                                >    
                                </Input>    
                                <Input 
                                    type="number"
                                    name="precoVendaAtacado"
                                    defaultValue={0}
                                    label="Preço de venda atacado:"
                                    error={errors.precoVendaAtacado}
                                    {...register('precoVendaAtacado')}
                                >    
                                </Input>
                            </SimpleGrid>
                            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                                <Input 
                                    type="number"
                                    defaultValue={0}
                                    name="precoCompra"
                                    label="Preço de compra:"
                                    error={errors.precoCompra}
                                    {...register('precoCompra')}
                                >    
                                </Input>    
                                <Input 
                                    type="number"
                                    defaultValue={0}
                                    name="margemLucro"
                                    label="Margem de lucro:"
                                    error={errors.margemLucro}
                                    {...register('margemLucro')}
                                >    
                                </Input>
                            </SimpleGrid>
                        </VStack>
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

export const getServerSideProps: GetServerSideProps = (async (ctx) => {    

    const { ['meiup.token']: token } = parseCookies(ctx)

    const response: any = await axios.get(`http://localhost:8000/api/v1/categorias`, 
    {headers: { Authorization: `Bearer ${token}` }});

    const result = response.data.found.categorias.map(e => {
        return {value: String(e.id),
        label: e.nome
    }})

    return {
        props: {
            result
        }
    }
})