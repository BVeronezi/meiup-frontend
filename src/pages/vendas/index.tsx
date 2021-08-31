import { Text } from "@chakra-ui/react";
import { ContainerPage } from "../../components/ContainerPage";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Vendas() {
    return (
        <ContainerPage title="Vendas"> 
            <Text>Vendas</Text>
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})