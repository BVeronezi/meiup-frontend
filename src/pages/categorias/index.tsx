import { Text } from "@chakra-ui/react";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Categorias() {
  return (
    <Sidebar>
      <Text>Categorias</Text>
    </Sidebar>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
