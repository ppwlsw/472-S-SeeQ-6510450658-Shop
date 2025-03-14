import { getAuthCookie } from "~/services/cookie";
import useAxiosInstance from "~/utils/axiosInstance";

export interface QueueType {
    id: number;
    name: string;
    description: string;
    queue_image_url?: string;
    queue_counter: number;
    is_available: boolean;
    tag: string;
    shop_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface QueueTypePayload {
    shop_id : number
    name : string,
    description : string,
    is_available : boolean,
    tag : string,
}

export async function fetchingQueuesType(request: Request, shop_id: number) {
    try {

        const cookie = await getAuthCookie({ request });
        const token = cookie.token;
        const response = await fetch(`http://laravel.test/api/queues?shop_id=${shop_id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        console.log(data.data);
        const queueTypes = data.data;
        return {
            queueTypes
        };

    } catch (error) {
        console.error("Error fetching queue types:", error);
        return { code: 500, data: [] };
    }
}

export async function createQueueType(request: Request, payload: QueueTypePayload) {
    try {
        const axios = useAxiosInstance(request);
        const response = await axios.post(`/queues`, payload);
        console.log("Queue type created successfully:", response);

    } catch (e) {
        console.error("error creating queue type : ", e);
    }
}