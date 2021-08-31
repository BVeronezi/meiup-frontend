import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';
import { api } from "../services/apiClient";

type User = {
    email: string;
    nome: string;
    empresa: Empresa;
    roles: string[];
};

type Empresa = {
    id: string
}

type SignCredentials = {
    email: string;
    senha: string;
}

type AuthContextData = {
    signIn: (credentials: SignCredentials) => Promise<void>;
    signOut: () => void;
    user: User | undefined;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel

export function signOut() {
    destroyCookie(undefined, 'meiup.token');
    destroyCookie(undefined, 'meiup.refreshToken');

    authChannel.postMessage('signOut');

    Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        authChannel = new BroadcastChannel('auth');

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    signOut();
                    authChannel.close();
                    break;
                default:
                    break;
            }
        }
    }, [])

    useEffect(() => {
        const { 'meiup.token': token } = parseCookies()

        if (token) {
            api.get('/me').then(response => {
              const { email, nome, empresa, roles } = response.data;

              setUser({
                  email,
                  empresa,
                  nome,
                  roles
              })
            })
            .catch(()  => {
                signOut();
            })
        }
    }, [])

    async function signIn({email, senha}: SignCredentials) {
        try {
            const response: any = await api.post('/auth/signin', {email, senha});

            const { token, nome, empresa, refreshToken, roles } = response.data;

            setCookie(undefined, 'meiup.token', token, {
                // Quanto tempo eu quero manter o cookie salvo no browser
                maxAge: 60 * 60 * 24 * 30,  // 30 days
                // Quais caminhos da aplicação tem acesso a esse cookie
                path: '/' // Qualquer endereço 
            });

            setCookie(undefined, 'meiup.refreshToken', refreshToken, {
                  maxAge: 60 * 60 * 24 * 30, 
                  path: '/' 
            });

            setUser({
                email,
                empresa,
                nome,
                roles
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard');     
        } catch (error) {
            console.log(error)
        }     
    }

    return (
        <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}