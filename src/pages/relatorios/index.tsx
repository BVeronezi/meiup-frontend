import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Relatorios() {
  return (
    <>
      <Head>
        <title>MEIUP | Relatórios</title>
      </Head>

      <Sidebar>
        <Stack as="form">
          <Box
            borderBottom="1px"
            borderLeft="1px"
            borderRight="1px"
            borderRadius="lg"
            borderColor="gray.300"
          >
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab data-cy="filtros" fontWeight="bold">
                  Filtros
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack marginTop="20px" spacing="12"></VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Stack>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
