interface Shop {
    id: number,
    name: string,
    email: string,
    is_verified: boolean,
    address: string,
    phone: string,
    description?: string,
    image_uri?: string,
    is_open: boolean,
    latitude: string,
    longitude: string,
    created_at: string,
    updated_at: string,
    deleted_at?: string,
}


let shop_provider: Record<number,Shop> = {} ;

function setShopProvider(user_id: number,  shop : Shop) {
  shop_provider[user_id] = shop;
}


export { shop_provider };
export { setShopProvider };