import useAxiosInstance from "~/utils/axiosInstance";

const AUTH_API = "/auth"

export async function sendForgetPasswordRequest(request: Request, email: string){
    try{
        const axios = useAxiosInstance(request, {without_token: true})
        await axios.post(AUTH_API+"/forget-password", {email})

        return true
    }catch(e){
        return false
    }
}

interface ResetPasswordRequestProps{
    email: string;
    password: string;
    token: string;
}
export async function sendResetPasswordRequest(request: Request, {email, password, token}:ResetPasswordRequestProps) {
    try{
        const axios = useAxiosInstance(request, {without_token: true})
        await axios.post(AUTH_API+"/reset-password", {email, password, token})

        return true
    }catch(e){
        return false
    }
}