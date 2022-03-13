import {
  Box,
  Button,
  HStack,
  SimpleGrid,
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
import { useContext, useState } from "react";
import moment from "moment";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import pt from "date-fns/locale/pt";
import { Input } from "../../components/Input";
import { api } from "../../services/apiClient";
import FornecedoresPDF from "./[...fornecedores]";
import VendasPDF from "./[...vendas]";
import { AuthContext } from "../../contexts/AuthContext";
import { LoadPage } from "../../components/Load";
registerLocale("pt", pt);

export enum TipoRelatorio {
  DRE = "1",
  FORNECEDORES = "2",
  VENDAS = "3",
}

export default function Relatorios() {
  const [stateTiposRelatorio, setStateTiposRelatorio] = useState("");
  const [dataInicio, setDataInicio] = useState(moment().toDate());
  const [dataFim, setDataFim] = useState(moment().add(1, "month").toDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useContext(AuthContext);

  const tiposRelatorio = [
    { value: "1", label: "DRE" },
    { value: "2", label: "Fornecedores" },
    { value: "3", label: "Vendas" },
  ];

  const handleTiposRelatorio = (tipoRelatorio) => {
    setStateTiposRelatorio(tipoRelatorio.value);
    setError(false);
  };

  const gerarRelatorio = async () => {
    if (!stateTiposRelatorio) {
      setError(true);
      return;
    }

    setLoading(true);

    switch (stateTiposRelatorio) {
      case TipoRelatorio.DRE:
        break;
      case TipoRelatorio.FORNECEDORES:
        const responseFornecedores = await api.get("/fornecedores");

        setLoading(false);
        FornecedoresPDF(
          responseFornecedores.data.found.fornecedores,
          user?.empresa
        );
        break;
      case TipoRelatorio.VENDAS:
        const responseVendas = await api.get("/vendas", {
          params: {
            dataInicio,
            dataFim,
            relatorio: true,
          },
        });
        setLoading(false);
        VendasPDF(
          responseVendas.data.found,
          dataInicio,
          dataFim,
          user?.empresa
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Head>
        <title>MEIUP | Relatórios</title>
      </Head>
      <LoadPage active={loading}>
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
                    <VStack marginTop="24px" spacing="12">
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Tipo relatório *</Text>
                          <Select
                            value={tiposRelatorio.filter(function (option) {
                              return option.value === stateTiposRelatorio;
                            })}
                            id="tipoRelatorio"
                            options={tiposRelatorio}
                            onChange={handleTiposRelatorio}
                            placeholder="Selecione o tipo de relatório"
                          />
                          {error && (
                            <Text color="red" fontSize="14px">
                              Tipo relatório obrigatório
                            </Text>
                          )}
                        </VStack>
                        {stateTiposRelatorio &&
                          stateTiposRelatorio !==
                            TipoRelatorio.FORNECEDORES && (
                            <>
                              <VStack align="left" spacing="4">
                                <Text fontWeight="bold">Data início *</Text>
                                <DatePicker
                                  locale="pt"
                                  dateFormat="dd MMMM, yyy"
                                  showPopperArrow={false}
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  selected={dataInicio}
                                  onChange={(date) => setDataInicio(date)}
                                  customInput={<Input />}
                                />
                              </VStack>
                              <VStack align="left" spacing="4">
                                <Text fontWeight="bold">Data fim *</Text>
                                <DatePicker
                                  locale="pt"
                                  dateFormat="dd MMMM, yyy"
                                  showPopperArrow={false}
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  selected={dataFim}
                                  onChange={(date) => setDataFim(date)}
                                  customInput={<Input />}
                                />
                              </VStack>
                            </>
                          )}
                      </SimpleGrid>
                      <Box alignSelf="flex-end">
                        <HStack>
                          <Button
                            data-cy="adicionar-produto"
                            fontSize="14px"
                            color="white"
                            backgroundColor="yellow.500"
                            onClick={gerarRelatorio}
                          >
                            GERAR RELATÓRIO
                          </Button>
                        </HStack>
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Stack>
        </Sidebar>
      </LoadPage>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
