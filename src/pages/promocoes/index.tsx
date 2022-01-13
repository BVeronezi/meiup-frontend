import { Sidebar } from "../../components/Sidebar";
import { PageNotFound } from "../../fragments/404/404";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Promocoes() {
  return (
    <Sidebar>
      <PageNotFound />
    </Sidebar>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
