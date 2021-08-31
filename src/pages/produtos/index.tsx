import { Text } from "@chakra-ui/react";
import { ContainerPage } from "../../components/ContainerPage";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Produtos() {
    return (
        <ContainerPage title="Produtos"> 
            <Text>Produtos</Text>
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})