import Head from "next/head";
import {
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChartBarDashboard } from "../../components/ChartBar";
import { ChartLineDashboard } from "../../components/ChartLine";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>MEIUP | Dashboard</title>
      </Head>

      <Sidebar>
        <SimpleGrid columns={2} spacing={10} flex="1">
          <Box
            p={["6", "8"]}
            borderRadius={8}
            border="1px"
            bg="gray.700"
            color="white"
            pb="4"
          >
            <Heading as="h2" title="estoque" size="md">
              Estoque
            </Heading>

            <Divider mb="4" />
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
            <Heading as="h2" title="vendas" size="md">
              Vendas
            </Heading>

            <Divider mb="4" />
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

          <Box p={["6", "8"]} borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Produtos mais vendidos
            </Text>
            <ChartBarDashboard />
          </Box>

          <Box p={["6", "8"]} borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Evolução das vendas
            </Text>
            <ChartLineDashboard />
          </Box>
        </SimpleGrid>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
