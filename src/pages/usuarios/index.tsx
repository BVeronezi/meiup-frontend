import { Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { ContainerPage } from "../../components/ContainerPage";
import { getUsers, useUsers } from "../../hooks/users/useUsers";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Usuarios({ users }) {
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching, error } = useUsers(page, {
        initialData: users
    });

    useEffect(() => {
      getListUsers()
    })

    async function getListUsers() {
        const { users, totalCount } = await getUsers(1);
    }

    return (
        <ContainerPage title="Usuários"> 
            <Text>Usuários</Text>
        </ContainerPage>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
        props: {
        }
    }
})
