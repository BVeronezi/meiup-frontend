import { Box, Divider, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChartBarDashboard } from "../../components/ChartBar";
import { ChartLineDashboard } from "../../components/ChartLine";
import { ContainerPage } from "../../components/ContainerPage";import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface DashboardProps {
    nome: string;
    email: string;
}

export default function Dashboard() {

    const [data, setData] = useState<DashboardProps>();
    
    useEffect(() => {
        async function getDadosUser() {
            const response: any = await api.get('/auth/me')

            setData(response.data);
        }

        getDadosUser()
    }, [])

    return (
        <ContainerPage title={`Olá, ${data?.nome || data?.email}`} subtitle="Boas vindas ao seu painel"> 
                <SimpleGrid columns={2} spacing={10} flex="1">
                    <Box
                        p={["6", "8"]}
                        borderRadius={8}
                        border="1px"
                        bg="gray.700"
                        color="white"
                        pb="4"
                    >
                        <Heading as="h2" size="md">Estoque</Heading>

                        <Divider mb="4"/>
                        <SimpleGrid align="end" spacing={4}>
                            <Stack>
                                <Text>Itens com estoque baixo</Text>
                                <Text>0</Text>
                            </Stack>
                            <Stack>
                                <Text>Itens cadastrados</Text>
                                <Text>30</Text>
                            </Stack>
                            <Stack>
                                <Text>Itens em promoção</Text>
                                <Text>5</Text>
                            </Stack>
                        </SimpleGrid>
                       
                    </Box>           
                    
                    <Box
                        p={["6", "8"]}
                        borderRadius={8}
                        border="1px"
                        bg="blue.300"
                        color="white"
                        pb="4"
                        >
                        <Heading as="h2" size="md">Vendas</Heading>

                        <Divider mb="4"/>
                        <SimpleGrid align="end" spacing={4}>
                            <Stack>
                                <Text>Hoje</Text>
                                <Text>0</Text>
                            </Stack>
                            <Stack>
                                <Text>Julho</Text>
                                <Text>30</Text>
                            </Stack>
                            <Stack>
                                <Text>Agosto</Text>
                                <Text>5</Text>
                            </Stack>
                        </SimpleGrid>

                    </Box>

                    <Box
                        p={["6", "8"]}
                        borderRadius={8}
                        pb="4"
                    >
                        <Text fontSize="lg" mb="4">Produtos mais vendidos</Text>
                        <ChartBarDashboard />
                    </Box>

                    <Box
                        p={["6", "8"]}
                        borderRadius={8}
                        pb="4"
                        >
                        <Text fontSize="lg" mb="4">Evolução das vendas</Text>
                        <ChartLineDashboard />
                    </Box>
                    </SimpleGrid>

        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})