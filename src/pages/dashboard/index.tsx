import {
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { LoadPage } from "../../../instrumented/components/Load";
import { ChartBarDashboard } from "../../components/ChartBar";
import { ChartLineDashboard } from "../../components/ChartLine";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Dashboard() {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const iconBoxInside = useColorModeValue("white", "white");
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await api.get("/dashboard");
      setData(response.data.found);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>MEIUP | Dashboard</title>
      </Head>

      <Sidebar>
        <LoadPage active={isLoading}>
          <SimpleGrid columns={2} spacing={10} flex="1">
            <Box
              p={["6", "8"]}
              borderRadius={8}
              border="1px"
              bg="gray.700"
              color="white"
              pb="2"
            >
              <Heading as="h2" title="estoque" size="md">
                Estoque
              </Heading>

              <Divider mb="4" />
              <SimpleGrid align="end" spacing={4}>
                <Stack>
                  <Text>Itens com estoque baixo</Text>
                  <Text>{data?.estoqueMinimo[0].count ?? 0}</Text>
                </Stack>
                <Stack>
                  <Text>Itens cadastrados</Text>
                  <Text>{data?.totalProdutos[0].count ?? 0}</Text>
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
              <Heading as="h2" title="vendas" size="md">
                Vendas
              </Heading>

              <Divider mb="4" />
              <SimpleGrid align="end" spacing={4}>
                <Stack>
                  <Text>Hoje</Text>
                  <Text>{data?.vendasHoje[0].cnt ?? 0}</Text>
                </Stack>
                <Stack>
                  <Text>Mês atual</Text>
                  <Text>{data?.vendasMesAtual[0].count ?? 0}</Text>
                </Stack>
                <Stack>
                  <Text>Mês anterior</Text>
                  <Text>{data?.vendasMesAnterior[0].count ?? 0}</Text>
                </Stack>
              </SimpleGrid>
            </Box>

            {data?.produtosMaisVendidos && (
              <Box p={["6", "8"]} borderRadius={8} pb="4">
                <Text fontSize="lg" mb="4">
                  Produtos mais vendidos
                </Text>
                <ChartBarDashboard dados={data?.produtosMaisVendidos} />
              </Box>
            )}

            {data?.servicosMaisVendidos && (
              <Box p={["6", "8"]} borderRadius={8} pb="4">
                <Text fontSize="lg" mb="4">
                  Serviços mais vendidos
                </Text>
                <ChartBarDashboard dados={data?.servicosMaisVendidos} />
              </Box>
            )}

            {data?.evolucaoVendaMes && (
              <Box p={["6", "8"]} borderRadius={8} pb="4">
                <Text fontSize="lg" mb="4">
                  Evolução das vendas no mês atual
                </Text>
                <ChartLineDashboard vendas={data?.evolucaoVendaMes} />
              </Box>
            )}
          </SimpleGrid>
        </LoadPage>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
