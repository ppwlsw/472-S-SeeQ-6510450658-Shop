import { reminder_provider, setShopProvider, setShopReminder, shop_provider, updateShopOpenStatus } from "~/provider/provider";
import { authCookie } from "~/services/cookie";
import useAxiosInstance from "~/utils/axiosInstance";

export async function fetchingShopData(user_id : number, request: Request) {
    try {
        const axios = useAxiosInstance(request)
        const shop : any = await axios.get("/users/"+user_id+"/shop")
        setShopProvider(user_id, shop.data);

      } catch (error) {
        console.error(error);
    }
    return {
        "code": 200,
        "shop" : shop_provider[user_id]
    }
}

export async function fetchingShopReminders(shop_id : number, request: Request) {
    try {
        const axios = useAxiosInstance(request);
        const reminders : any = await axios.get("/shops/reminders/"+shop_id+"");

        setShopReminder(shop_id ,reminders);

      } catch (error) {
        console.error(error);
    }
    return {
        "code": 200,
        "data" : [reminder_provider[shop_id]]
    }
}

export async function changeShopOpenStatus(shop_id : number, request: Request){
  try {
    const axios = useAxiosInstance(request);
    const response = await axios.put("shops/"+shop_id+"/is-open");
    const cookie = request.headers.get("Cookie");
    const data = await authCookie.parse(cookie);
    var user_id = data.user_id;
    updateShopOpenStatus(user_id);

  } catch (error) {
    console.error(error);
  }
  return {
    "code": 200,
    "data": "Shop status changed successfully",
    "shop": shop_provider[user_id]
  }
}