import { ChevronLeft, Edit } from "lucide-react";
import { useState } from "react";
import {
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { shop_provider } from "~/provider/provider";
import { useAuth } from "~/utils/auth";

interface item {
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  is_available: boolean;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const auth = await getCookie({ request: request });
  const user_id = auth.user_id;
  const shop_id = shop_provider[user_id].id;
  const responseApiUrl = await fetch(
    `${process.env.API_BASE_URL}/shops/${shop_id}/item`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  if (!responseApiUrl.ok) {
    return redirect("/shops");
  }

  const apiJson = await responseApiUrl.json();
  const api_url = apiJson.data.api_url ?? "";

  if (api_url === "") {
    return {
      id: shop_id,
      api_url: "",
      items: [],
    };
  }

  const responseItems = await fetch(
    `${process.env.API_BASE_URL}/shops/${shop_id}/recommend-items`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  if (!responseItems.ok) {
    return {
      id: shop_id,
      api_url: api_url,
      items: [],
    };
  }

  const itemsJson = await responseItems.json();
  const items: item[] = itemsJson.data;

  return {
    id: shop_id,
    api_url: api_url,
    items: items,
  };
}

export default function ItemsPage() {
  const { id, api_url, items } = useLoaderData<typeof loader>();
  const [editApiUrl, setEditApiUrl] = useState(false);
  const [newApiUrl, setNewApiUrl] = useState(api_url);
  const [newApiKey, setNewApiKey] = useState("");

  return (
    <div className="flex flex-col items-center px-10 py-6 animate-fade-in">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-[rgb(0,0,0,0.5)]">รายการสินค้า</h1>
        </div>
      </div>
      <div className="flex flex-col items-center py-6 px-10 w-full mt-10">
        <div className="flex flex-row w-full gap-4 justify-center items-center">
          <label htmlFor="api_url" className="w-1/4">
            API URL ของฐานข้อมูลของรายการสินค้า:
          </label>
          <input
            placeholder={`${api_url === "" ? "ไม่มี URL API" : ""}`}
            onChange={(e) => setNewApiUrl(e.target.value)}
            value={`${newApiUrl}`}
            type="text"
            disabled={!editApiUrl}
            className={`border-2 rounded-lg p-2 bg-white w-full transition-all duration-300 ${
              editApiUrl
                ? ""
                : "cursor-not-allowed text-[rgb(0,0,0,0.6)] border-[rgb(0,0,0,0.4)]"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col items-center py-6 px-10 w-full mt-10">
        <h1 className="text-xl font-medium">รายการสินค้า</h1>
        <div className="w-full flex flex-col gap-4 mt-4">
          {items.map((item: item) => (
            <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-row justify-between items-center">
              <div className="flex flex-row gap-4 items-center">
                <img
                  src={item.image_url}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex flex-col gap-2">
                  <h1 className="text-lg font-medium">{item.name}</h1>
                  <p className="text-[rgb(0,0,0,0.5)]">{item.is_available}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <h1 className="text-lg font-medium">{item.price} บาท</h1>
                <h1 className="text-[rgb(0,0,0,0.5)]">{item.quantity} ชิ้น</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
