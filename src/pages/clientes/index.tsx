import { Text } from "@chakra-ui/react";
import { ContainerPage } from "../../components/ContainerPage";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Clientes() {
    return (
        <ContainerPage title="Clientes"> 
            <Text>Clientes</Text>
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})