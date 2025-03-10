import { useState } from "react";
import {
  Store,
  XCircle,
  Pencil,
  Save,
  Lock,
  Camera,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import {
  redirect,
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
} from "react-router";
import ChangePasswordModal from "~/components/change-password";
import { shop_provider } from "~/provider/provider";
import { authCookie } from "~/services/cookie";
import { changeShopOpenStatus } from "~/apis/shop-api";
import Swal from "sweetalert2";

interface UpdateShopRequest {
  name: string;
  address: string;
  phone: string;
  description: string;
}

export async function loader({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("cookie");
  const data = await authCookie.parse(cookie);

  if (!data) {
    return redirect("/login");
  }

  const user_id = data.user_id;
  const shop = shop_provider[user_id];

  if (!shop) {
    return redirect("/create-shop");
  }

  return { user_id, shop };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const cookie = request.headers.get("cookie");
  const data = await authCookie.parse(cookie);

  if (!data) {
    return redirect("/login");
  }
  const user_id = data.user_id;
  const shop_id = shop_provider[user_id].id;
  const shop = shop_provider[user_id];

  switch (action) {
    case "storeStatus":
      console.log("Store status action");
      try {
        const response = await changeShopOpenStatus(shop_id, request);
      } catch (error) {
        console.error(error);
      }
      break;

    case "updateShop":
      console.log("Update shop action");
      const updateData: UpdateShopRequest = {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        description: formData.get("description") as string,
      };
      console.log(updateData);
      break;
  }
}

function StoreManagePage() {
  const [storeName, setStoreName] = useState("My Store");
  const [storeAddress, setStoreAddress] = useState("123 Main Street");
  const [storePhone, setStorePhone] = useState("555-123-4567");
  const [storeDescription, setStoreDescription] = useState(
    "A wonderful store with great products"
  );
  const [storeImage, setStoreImage] = useState("/starbuck.png");
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fetcher = useFetcher();

  const { shop } = useLoaderData<typeof loader>();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreAddress(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStorePhone(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setStoreDescription(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setStoreImage(imageUrl);
    }
  };

  const handleEditButton = () => {
    setIsEditing((prev) => !prev);
  };

  const handleStoreStatusChange = (e: any) => {
    e.preventDefault(); // Prevent default form submission

    Swal.fire({
      title: shop.is_open ? "Close Store?" : "Open Store?",
      text: shop.is_open
        ? "Are you sure you want to close your store?"
        : "Are you sure you want to open your store?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: shop.is_open ? "#d33" : "#08db0f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: shop.is_open ? "Yes, close it!" : "Yes, open it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Submit the form programmatically
        fetcher.submit({ _action: "storeStatus" }, { method: "PUT" });

        // Optional: Show success message after submission
        Swal.fire(
          "Success!",
          shop.is_open
            ? "Your store has been closed."
            : "Your store is now open.",
          "success"
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-5 items-center p-6">
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <div className="flex justify-end space-x-9 items-center w-full">
        <fetcher.Form method="PUT" className="flex items-center gap-4">
          <span className="font-medium flex items-center gap-2">
            {shop.is_open ? (
              <Store className="text-green-500" size={20} />
            ) : (
              <XCircle className="text-red-500" size={20} />
            )}
            Status: {shop.is_open ? "Open" : "Closed"}
          </span>
          <button
            type="submit"
            onClick={handleStoreStatusChange}
            name="_action"
            value="storeStatus"
            className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
              shop.is_open
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {shop.is_open ? "Close Store" : "Open Store"}
          </button>
        </fetcher.Form>
      </div>

      <div className="w-full max-w-2xl p-4 shadow-lg border rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          {/* Edit/View Profile Section */}
          <div className="flex flex-col items-center">
            <label htmlFor="store-image" className="cursor-pointer relative">
              <div className="rounded-full w-44 h-44 overflow-hidden border group">
                <img
                  src={storeImage}
                  alt="Store"
                  className="w-full h-full object-cover"
                />
                <div className="w-44 h-44 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="text-white" size={36} />
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                Click to change image
              </div>
            </label>
            <input
              id="store-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={!isEditing}
              className="hidden"
            />
          </div>

          {/* Separate Edit Button from Form */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white flex items-center gap-2 cursor-pointer"
            >
              <Lock size={18} />
              Change Password
            </button>

            <button
              type="button"
              onClick={handleEditButton}
              className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white flex items-center gap-2 cursor-pointer"
            >
              <Pencil size={18} /> Edit
            </button>
          </div>

          {/* Form for Saving Changes */}
          {isEditing && (
            <fetcher.Form method="PUT" className="w-full space-y-6">
              <div className="w-full space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="font-medium flex items-center gap-2"
                  >
                    <Store size={16} /> Store Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={storeName}
                    onChange={handleNameChange}
                    className="mt-2 w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="font-medium flex items-center gap-2"
                  >
                    <MapPin size={16} /> Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={storeAddress}
                    onChange={handleAddressChange}
                    className="mt-2 w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="font-medium flex items-center gap-2"
                  >
                    <Phone size={16} /> Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={storePhone}
                    onChange={handlePhoneChange}
                    className="mt-2 w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="font-medium flex items-center gap-2"
                  >
                    <FileText size={16} /> Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={storeDescription}
                    onChange={handleDescriptionChange}
                    rows={4}
                    className="mt-2 w-full p-2 border rounded-lg resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  name="_action"
                  value="updateShop"
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </fetcher.Form>
          )}

          {/* View-only fields when not editing */}
          {!isEditing && (
            <div className="w-full space-y-4">
              <div>
                <label className="font-medium flex items-center gap-2">
                  <Store size={16} /> Store Name
                </label>
                <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                  {storeName}
                </div>
              </div>

              <div>
                <label className="font-medium flex items-center gap-2">
                  <MapPin size={16} /> Address
                </label>
                <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                  {storeAddress}
                </div>
              </div>

              <div>
                <label className="font-medium flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                  {storePhone}
                </div>
              </div>

              <div>
                <label className="font-medium flex items-center gap-2">
                  <FileText size={16} /> Description
                </label>
                <div className="mt-2 p-2 border rounded-lg bg-gray-50 min-h-24">
                  {storeDescription}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreManagePage;
