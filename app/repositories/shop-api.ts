import { setShopProvider, shop_provider, updateShopOpenStatus } from "~/provider/provider";
import { useAuth } from "~/utils/auth";
import useAxiosInstance from "~/utils/axiosInstance";

export interface UpdateShopRequest {
  name: string;
  address: string;
  phone: string;
  description: string;
}

export async function fetchingShopData(user_id : number, request: Request) {
    try {
        const axios = useAxiosInstance(request)
        const shop : any = await axios.get(`/users/${user_id}/shop`)
        await setShopProvider(user_id, shop);

      } catch (error) {
        console.error(error);
    }
    return {
        "code": 200,
        "shop" : shop_provider[user_id]
    }
}

export async function changeShopOpenStatus(shop_id : number, request: Request){
  let user_id = 0;
  try {
    const axios = useAxiosInstance(request);
    const response = await axios.put(`shops/${shop_id}/is-open`);
    const { getCookie } = useAuth;
    const data = await getCookie({request})
    user_id = data.user_id;
    updateShopOpenStatus(user_id);
    return {
      "code": 200,
      "data": "Shop status changed successfully",
      "shop": shop_provider[user_id]
    }

  } catch (error) {
    console.error(error);
  }
  
}

export async function updateShop(shop_id : number, updateRequest : UpdateShopRequest, request : Request){
  try {
    const axios = useAxiosInstance(request);
    var response = await axios.put(`shops/${shop_id}`, updateRequest)
  } catch (e) {
    console.error(e);
  }
  return {
    "code" : 200,
    "data" : response!.data,
  }
}

export async function changeshopAvatar(shop_id: number, formData: FormData, request: Request) {
  try {
    const { getCookie } = useAuth;
    const data = await getCookie({request})
    const token = data.token;
    const response = await fetch(`${process.env.APP_URL}/shops/${shop_id}/avatar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData, 
    });

    
  } catch (e) {
    console.error("Error:", e);
  }
}
