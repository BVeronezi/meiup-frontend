import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import decode from 'jwt-decode';
import { validateUserRoles } from "./validateUserRoles";

type withSSRAuthOptions = {
  roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: withSSRAuthOptions) {

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {  
        const cookies = parseCookies(ctx);
        const token = cookies['meiup.token'];
      
        if (!token) {
          return {
            redirect: {
              destination: '/',
              permanent: false
            }
          }
        }

        if (options) {
          const user = decode<{ permissions: string[], roles: string[] }>(token);
          const { roles } = options;
  
          const userHasValidPermissions = validateUserRoles({
            user,
            roles
          })

          if (!userHasValidPermissions) {
            return {
              redirect: {
                destination: '/dashboard',
                permanent: false
              }
            }
          }
        }

        try {
          return await fn(ctx);
        } catch (error) {
          if (error instanceof AuthTokenError) {
            destroyCookie(ctx, 'meiup.token');
            destroyCookie(ctx, 'meiup.refreshToken');
  
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
          }
        }
    }
}