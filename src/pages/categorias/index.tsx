import { Text } from "@chakra-ui/react";
import { ContainerPage } from "../../components/ContainerPage";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Categorias() {
    return (
        <ContainerPage title="Categorias"> 
            <Text>Categorias</Text>
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})