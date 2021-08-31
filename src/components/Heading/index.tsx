import { Heading, Spinner } from "@chakra-ui/react";

interface HeadingsProps {
    title: string;
    isLoading?: boolean;
    isFetching?: boolean;
}

export function Headings({ title, isLoading = false, isFetching = false}: HeadingsProps) {
    return (
        <Heading size="md" fontWeight="normal">{title}
        {
            !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4"/>
        }
        </Heading>
    )
}