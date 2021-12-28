import { Stack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { ContainerPage } from "../../components/ContainerPage";

type FormData = {
  usuario: string;
  dataVenda: string;
  cliente: string;
};

export default function FormVendas() {
  //   const { register, handleSubmit, formState, setValue } = useForm({
  //     resolver: yupResolver(produtoFormSchema),
  //   });

  const handleVenda: SubmitHandler<FormData> = async (values) => {};

  return (
    <ContainerPage title="Venda" subtitle="Nova Venda">
      {/* <Stack as="form" onSubmit={handleSubmit(handleProduto)} flex="1"></Stack> */}
    </ContainerPage>
  );
}
