import { redirect } from "react-router";
import { setShopProvider, shop_provider } from "~/provider/provider";

export async function fetchingShopData(user_id : number, token : string) {
    try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/users/${user_id}/shop`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          throw redirect("/login");
        }    
        const shop = await response.json();
        console.log("SHOP : ", shop);
    
        if (!shop) {
          throw redirect("/login");
        } 

        setShopProvider(user_id, shop.data);

      } catch (error) {
        console.error(error);
    }
    return {
        "code": 200,
        "shop" : shop_provider[user_id]
    }
}