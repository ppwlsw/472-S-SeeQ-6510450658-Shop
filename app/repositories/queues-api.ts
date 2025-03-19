import { setQueueProvider } from "~/provider/provider";
import { authCookie, getAuthCookie } from "~/utils/cookie";
import useAxiosInstance from "~/utils/axiosInstance";

export interface QueueType {
    id: number;
    name: string;
    description: string;
    image_url?: string;
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
    image : File,
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
        const queueTypes = data.data;
        setQueueProvider(shop_id, queueTypes);
        return {
            queueTypes
        };

    } catch (error) {
        console.error("Error fetching queue types:", error);
        return { code: 500, data: [] };
    }
}

export async function createQueueType(request: Request, payload: FormData) {
    console.log("payload", payload);
    try {
        const cookie = request.headers.get("cookie");
        const data = await authCookie.parse(cookie);
        const token = data.token;
        const response = await fetch(`${process.env.APP_URL}/queues`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: payload, 
        });
    
        console.log("Queue type created successfully:", await response.json());

    } catch (e) {
        console.error("error creating queue type : ", e);
    }
}

export async function fetchQueueDetail(request: Request, queue_id: number) {
    try {
        const cookie = await getAuthCookie({ request });
        const token = cookie.token;
        const response = await fetch(`http://laravel.test/api/queues/${queue_id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        const queue = data;
        return queue;

    } catch (error) {
        console.error("Error fetching queue detail:", error);
        return { code: 500, data: [] };
    }
}

export async function fetchCustomerInQueue(request: Request, shop_id: number) {
    try {
        const cookie = await getAuthCookie({ request });
        const token = cookie.token;
        const response = await fetch(`http://laravel.test/api/queues/${shop_id}/getAllQueue`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            method : "GET"
        });

        const data = await response.json();
        const inQueues = data;
        return inQueues;

    } catch (error) {
        console.error("Error fetching queue types:", error);
        return { code: 500, data: [] };
    }
}

export async function nextQueue(request : Request, queue_id: number ) {
    try {
        const cookie = await getAuthCookie({ request });
        const token = cookie.token;
        const response = await fetch(`http://laravel.test/api/queues/${queue_id}/next`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            method : "POST"
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching queue types:", error);
        return { code: 500, data: [] };
    }
}

export async function changeQueueStatus(request: Request, queue_id: number, status: boolean) {
    try {
    
        const cookie = await getAuthCookie({ request });
        const token = cookie.token;
        const response = await fetch(`http://laravel.test/api/queues/${queue_id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method : "PATCH",
            body : JSON.stringify({
                "is_available" : status
            })
        });


        const data = await response.json();
        console.log("data in changeStatus", data);
        return data;

    } catch (error) {
        console.error("Error fetching queue types:", error);
        return { code: 500, data: [] };
    }
}