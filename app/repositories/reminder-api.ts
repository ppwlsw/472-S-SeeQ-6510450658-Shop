import { setShopReminder, reminder_provider } from "~/provider/provider";
import { authCookie } from "~/services/cookie";
import useAxiosInstance from "~/utils/axiosInstance";

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