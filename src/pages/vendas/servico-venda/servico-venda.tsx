import { createStandaloneToast, SimpleGrid, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { theme as customTheme } from "../../../styles/theme";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import * as yup from "yup";
import { getServicosVenda } from "../../../hooks/vendas/useServicoVenda";

const produtoVendaFormSchema = yup.object().shape({
  servico: yup.string(),
  precoUnitario: yup.number(),
  outrasDespesas: yup.number(),
  desconto: yup.number(),
  valorTotal: yup.number(),
});

export default function ServicoVenda({ servicos }) {
  const router = useRouter();
  const vendaId: any = Object.keys(router.query)[0];
  const [stateServico, setStateServico] = useState("");
  const [idServicoVenda, setIdServicoVenda] = useState();
  const [addServico, setAddServico] = useState(true);
  const toast = createStandaloneToast({ theme: customTheme });
  const [page, setPage] = useState(1);

  const [selectedServico, setSelectedServico] = useState({
    id: 0,
    valorTotal: 0,
    servico: { id: 0, nome: "" },
  });

  const [data, setData] = useState({
    servicosVenda: [
      {
        id: 0,
        quantidade: 0,
        valorTotal: 0,
        produto: { id: 0, nome: "" },
      },
    ],
    totalCount: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const { register, formState, setValue, getValues } = useForm({
    resolver: yupResolver(produtoVendaFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    // async function fetchData() {
    //   const result: any = await getServicosVenda(page, null, vendaId);
    //   setData(result);
    // }
    // fetchData();

    console.log(servicos);
  }, [refreshKey]);

  return (
    <>
      <VStack marginTop="14px" spacing="12">
        <SimpleGrid
          minChildWidth="240px"
          spacing={["6", "8"]}
          w="100%"
        ></SimpleGrid>
      </VStack>
    </>
  );
}
