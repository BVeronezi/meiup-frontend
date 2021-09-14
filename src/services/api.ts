import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

type FailedRequestQueue = { 
    onSuccess: (token: string) => void 
    onFailure: (err: AxiosError<any>) => void
}  

let isRefreshing = false;
let failedRequestsQueue = <FailedRequestQueue[]>[]

export function setupAPIClient(ctx = undefined) {

    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: `https://meiup-api.herokuapp.com/api/v1`,
        headers: {
            Authorization: `Bearer ${cookies['meiup.token']}`,
        }
    })

    console.log(api.interceptors.response)

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error?.response?.status === 401) {
            if (error.response.data?.code === 'token.expired') {
                // renovar token 
                cookies = parseCookies(ctx);
    
                const { 'meiup.refreshToken': refreshToken } = cookies;
                const originalConfig = error.config;
    
                if (!isRefreshing) {
                    isRefreshing = true;
    
                    api.post('/refresh', {
                        refreshToken,
                    }).then(response => {
        
                        const { token } = response.data;
        
                        setCookie(ctx, 'meiup.token', token, {
                            maxAge: 60 * 60 * 24 * 30, 
                            path: '/' 
                        });
            
                        setCookie(ctx, 'meiup.refreshToken', response.data.refreshToken, {
                            maxAge: 60 * 60 * 24 * 30, 
                            path: '/' 
                        });
        
                        api.defaults.headers['Authorization'] = `Bearer ${token};`
    
                        failedRequestsQueue.forEach(request => request.onSuccess(token));
                        failedRequestsQueue = [];
                    }).catch(err => {
                        failedRequestsQueue.forEach(request => request.onFailure(err));
                        failedRequestsQueue = [];
    
                        if (process.browser) {
                            signOut();
                        }
                    }).finally(() => {
                        isRefreshing = false;
                    });              
                }
    
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`;
    
                            resolve(api(originalConfig))
                        },
                        onFailure: (err: AxiosError) => {
                            reject(err)
                        }
                    })
                })
            } else {
                // deslogar usuário
                if (process.browser) {
                    signOut();
                } else {
                    return Promise.reject(new AuthTokenError());
                }
            }
        }
    
        return Promise.reject(error);
    })

    return api
}