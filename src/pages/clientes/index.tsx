import { Text } from "@chakra-ui/react";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Clientes() {
  return (
    <Sidebar>
      <Text>Clientes</Text>;
    </Sidebar>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
