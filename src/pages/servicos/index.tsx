import { Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Servicos() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <Sidebar>
      <Text>Servoços</Text>
    </Sidebar>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
