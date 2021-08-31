import { Text } from "@chakra-ui/react";
import { ContainerPage } from "../../components/ContainerPage";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Promocoes() {
    return (
        <ContainerPage title="Promoções"> 
            <Text>Promoções</Text>
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})