import { data } from "react-router";
import { setShopReminder, reminder_provider } from "~/provider/provider";
import useAxiosInstance from "~/utils/axiosInstance";

export interface ReminderProp {
    shop_id : number,
    title : string,
    description: string,
    due_date : any
}

export async function fetchingShopReminders(shop_id: number, request: Request) {
    try {
        const axios = useAxiosInstance(request);
        const response = await axios.get(`/shops/reminders/${shop_id}`);

        const reminders = response

        if (!Array.isArray(reminders)) {
            console.error("Invalid reminder data format:", reminders);
            return { code: 500, data: [] };
        }

        reminder_provider[shop_id] = [];

        for (const reminder of reminders) {
            setShopReminder(shop_id, reminder);
        }

    } catch (error) {
        console.error("Error fetching reminders:", error);
        return { code: 500, data: [] };
    }

    return {
        code: 200,
        data: reminder_provider[shop_id] || [], // Ensure it's an array
    };
}


export async function createShopReminder(request: Request, payload : ReminderProp) {
    try {
        const axios = useAxiosInstance(request);
        const response = await axios.post(`/shops/reminders`, payload)

    } catch (e) {
        console.error("error creating reminder : ", e);
    }
}

export async function markReminderAsDone(request: Request, reminder_id: number) {
    try {
        const axios = useAxiosInstance(request);
        const response = await axios.patch(`/shops/reminders/${reminder_id}`)

    } catch (e) {
        console.error("error marking reminder as done : ",
        e);
    }
}