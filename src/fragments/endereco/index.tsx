import { Box, SimpleGrid, VStack } from "@chakra-ui/layout";
import axios from "axios";
import { Headings } from "../../components/Heading";
import { Input } from "../../components/Input";

export function Endereco({ register, errors, isLoading, buscaCep }) {

    return (
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
                        onChange={c => buscaCep(c.target.value)}
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
    )
}