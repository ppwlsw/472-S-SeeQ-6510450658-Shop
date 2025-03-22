import { prefetchImage } from "~/utils/image-proxy";

interface Shop {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  address: string;
  phone: string;
  description?: string;
  image_url?: string;
  is_open: boolean;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface Reminder {
  id: number;
  shop_id: number;
  title: string;
  description: string;
  due_date: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface QueueType {
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


let shop_provider: Record<number, Shop> = {};

let reminder_provider: Record<number, Reminder[]> = {};

let queue_provider: Record<number, QueueType[]> = {};

async function setShopProvider(user_id: number, shop: Shop) {
  const image_url = await prefetchImage(shop.image_url ?? "");
  shop.image_url = image_url
  shop_provider[user_id] = shop;
  console.log("set shop_provider", shop_provider[user_id]);
}

function updateShopOpenStatus(user_id: number) {
  shop_provider[user_id].is_open = !shop_provider[user_id].is_open;
}

function setShopReminder(shop_id: number, reminder: Reminder) {
  if (!reminder_provider[shop_id]) {
    reminder_provider[shop_id] = [];
  }
  reminder_provider[shop_id].push(reminder);
}

function setQueueProvider(shop_id: number, queueTypes: QueueType[]) {
  queue_provider[shop_id] = queueTypes;
  console.log("set queue_provider", queue_provider);
}

export { shop_provider, reminder_provider, queue_provider};
export { setShopProvider, setShopReminder, updateShopOpenStatus, setQueueProvider };
