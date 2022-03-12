import {
  Box,
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
import { useForm } from "react-hook-form";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import pt from "date-fns/locale/pt";
import { Input } from "../../components/Input";
import { api } from "../../services/apiClient";
registerLocale("pt", pt);

type FormData = {
  tipoRelatorio: string;
  usuario: string;
};

const relatorioSchema = yup.object().shape({
  tipoRelatorio: yup.string().required("Tipo de relatório obrigatório"),
});

export default function Relatorios() {
  const [stateTiposRelatorio, setStateTiposRelatorio] = useState("");
  const [dataInicio, setDataInicio] = useState();
  const [dataFim, setDataFim] = useState();

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(relatorioSchema),
  });

  const tiposRelatorio = [
    { value: "1", label: "DRE" },
    { value: "2", label: "Fornecedores" },
    { value: "3", label: "Vendas" },
  ];

  const INITIAL_DATA = {
    value: 0,
    label: "Selecione o usuário",
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  async function callApi(value) {
    const responseUsuarios: any = await api.get(`/usuario`, {
      params: { limit: 10, nome: value },
    });

    const data = responseUsuarios.data.found.users.map((e) => {
      return { value: String(e.id), label: e.nome, email: e.email };
    });

    console.log(responseUsuarios);
    return data;
  }

  const handleTiposRelatorio = (tipoRelatorio) => {
    setStateTiposRelatorio(tipoRelatorio.value);
  };

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
                  <VStack marginTop="24px" spacing="12">
                    <SimpleGrid
                      minChildWidth="240px"
                      spacing={["6", "8"]}
                      w="100%"
                    >
                      <VStack align="left" spacing="4">
                        <Text fontWeight="bold">Tipo relatório</Text>
                        <Select
                          {...register("tipoRelatorio")}
                          value={tiposRelatorio.filter(function (option) {
                            return option.value === stateTiposRelatorio;
                          })}
                          id="tipoRelatorio"
                          options={tiposRelatorio}
                          onChange={handleTiposRelatorio}
                          placeholder="Selecione o tipo de relatório"
                        />
                      </VStack>
                      <VStack align="left" spacing="4">
                        <Text fontWeight="bold">Data início</Text>
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
                        <Text fontWeight="bold">Data fim</Text>
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
                    </SimpleGrid>
                    {stateTiposRelatorio === "3" && (
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["6", "8"]}
                        w="100%"
                      >
                        <VStack align="left" spacing="4">
                          <Text fontWeight="bold">Usuário</Text>
                          <AsyncSelect
                            id="cliente"
                            {...register("usuario")}
                            cacheOptions
                            loadOptions={callApi}
                            onChange={(u) => setselectData(u)}
                            value={selectData}
                            defaultOptions
                            loadingMessage={() => "Carregando..."}
                            noOptionsMessage={() => "Nenhum usuário encontrado"}
                          />
                        </VStack>
                      </SimpleGrid>
                    )}
                  </VStack>
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
