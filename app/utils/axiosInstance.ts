import axios, { type AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { useAuth } from "./auth";

function useAxiosInstance(
    request: Request,
    options: { raw?: boolean; without_token?: boolean; custom_token?:string; isFormData?:boolean; } = {}
): AxiosInstance {
    const { raw = false, without_token = false, custom_token="", isFormData = false } = options;

    const axiosInstance: AxiosInstance = axios.create({
        baseURL: process.env.API_BASE_URL,
        headers: {
            "Content-Type": process.env.CONTENT_TYPE || isFormData?"multipart/form-data":"application/json",
            "X-Content-Type-Options": "nosniff",
        },
        timeout: 10000,
        withCredentials: true,
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            if (!without_token) {
                let token = custom_token;
    
                if (!token) {
                    const { getCookie } = useAuth;
                    const cookie =  await getCookie({ request });
                    token = cookie?.token;
                }
    
                if (token) {
                    try {
                        config.headers.Authorization = `Bearer ${token}`;
                    } catch (e) {
                        throw e;
                    }
                }
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => (raw ? response : response.data?.data ?? response.data),
        (error) => {
            if (error.response) {
                console.error(`API Error: ${error.response.status}`);
            } else if (error.request) {
                console.error("Network error");
            }
            return Promise.reject(error);
        }
    );

    axiosRetry(axiosInstance, {
        retries: 2,
        shouldResetTimeout: true,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) =>
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            error.response?.status === 500,
    });

    return axiosInstance;
}

export default useAxiosInstance;