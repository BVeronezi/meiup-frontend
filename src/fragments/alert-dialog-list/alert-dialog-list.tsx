import { 
    AlertDialog, 
    AlertDialogBody, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogOverlay, 
    Button 
} 
from "@chakra-ui/react";

export function AlertDialogList({ isOpen, cancelRef, onClose, header, body, handleDelete, description}) {
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
            <AlertDialogContent color="black">
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {header}
                </AlertDialogHeader>

                <AlertDialogBody>
                {body} {description} ? 
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                    Cancelar
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                    Remover
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}