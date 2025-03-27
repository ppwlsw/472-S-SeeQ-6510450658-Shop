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
  image_url?: string;
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
  shop_provider[user_id] = shop;
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

async function setQueueProvider(shop_id: number, queueTypes: QueueType[]) {
  queue_provider[shop_id] = queueTypes;
}

async function updateQueueProvider(shop_id: number, queueType: QueueType) {
  const index = queue_provider[shop_id].findIndex(queue => queue.id === queueType.id);

  if (index === -1) {
    console.log("IT'S A NEW QUEUE TYPE - PUSHING : ", queueType);
    queue_provider[shop_id].push(queueType);
  } else {
    console.log("IT'S AN EXISTING QUEUE TYPE - UPDATING : ", queueType);
    queue_provider[shop_id][index] = queueType;
  }


}

function deleteQueueTypeProvider(shop_id: number, queueType_id: number) {
  queue_provider[shop_id] = queue_provider[shop_id].filter(
    (queue) => queue.id !== queueType_id
  );
}

export { shop_provider, reminder_provider, queue_provider };
export {
  setShopProvider,
  setShopReminder,
  updateShopOpenStatus,
  setQueueProvider,
  deleteQueueTypeProvider,
  updateQueueProvider,
};
