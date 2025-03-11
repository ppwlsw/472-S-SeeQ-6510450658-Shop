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

let shop_provider: Record<number, Shop> = {};

let reminder_provider: Record<number, Reminder> = {};

function setShopProvider(user_id: number, shop: Shop) {
  shop_provider[user_id] = shop;
}

function updateShopOpenStatus(user_id: number) {
  shop_provider[user_id].is_open = !shop_provider[user_id].is_open;
}

function setShopReminder(shop_id: number, reminder: Reminder) {
  reminder_provider[shop_id] = reminder;
}

export { shop_provider, reminder_provider };
export { setShopProvider, setShopReminder, updateShopOpenStatus };
