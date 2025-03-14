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
  useRevalidator,
  type ActionFunctionArgs,
} from "react-router";
import ChangePasswordModal from "~/components/change-password";
import { shop_provider } from "~/provider/provider";
import { authCookie } from "~/services/cookie";
import {
  changeshopAvatar,
  changeShopOpenStatus,
  fetchingShopData,
  updateShop,
  type UpdateShopRequest,
} from "~/repositories/shop-api";
import Swal from "sweetalert2";

export async function loader({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("cookie");
  const data = await authCookie.parse(cookie);

  if (!data) {
    return redirect("/login");
  }

  const user_id = data.user_id;
  const shop = shop_provider[user_id];
  fetchingShopData(user_id, request);
  if (!shop) {
    return redirect("/login");
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
    case "shopStatus":
      try {
        const response = await changeShopOpenStatus(shop_id, request);
      } catch (error) {
        console.error(error);
      }
      break;

    case "updateShop":
      const content: UpdateShopRequest = {
        name: formData.get("name") as string,
        address: shop.address,
        phone: formData.get("phone") as string,
        description: formData.get("description") as string,
      };
      updateShop(shop_id, content, request);
      break;

    case "changeShopImage":
      changeshopAvatar(shop_id, formData, request);

      break;
  }
}

function ShopManagePage() {
  const { shop } = useLoaderData<typeof loader>();
  const shopName = shop.name;
  const shopAddress = shop.address;
  const shopPhone = shop.phone;
  const shopDescription = shop.description;
  const shopImage = shop.image_url;
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fetcher = useFetcher();
  const handleEditButton = () => {
    setIsEditing((prev) => !prev);
  };

  const handleShopStatusChange = (e: any) => {
    e.preventDefault(); // Prevent default form submission

    Swal.fire({
      title: shop.is_open ? "Close Shop?" : "Open Shop?",
      text: shop.is_open
        ? "Are you sure you want to close your Shop?"
        : "Are you sure you want to open your Shop?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: shop.is_open ? "#d33" : "#08db0f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: shop.is_open ? "Yes, close it!" : "Yes, open it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Submit the form programmatically
        fetcher.submit({ _action: "shopStatus" }, { method: "PUT" });

        // Optional: Show success message after submission
        Swal.fire(
          "Success!",
          shop.is_open
            ? "Your shop has been closed."
            : "Your shop is now open.",
          "success"
        );
      }
    });
  };

  const validator = useRevalidator();
  const [previewImage, setPreviewImage] = useState<any>(shopImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setIsChangingImage(true);
    }
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
            onClick={handleShopStatusChange}
            name="_action"
            value="shopStatus"
            className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
              shop.is_open
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {shop.is_open ? "Close Shop" : "Open Shop"}
          </button>
        </fetcher.Form>
      </div>

      <div className="w-full max-w-2xl p-4 shadow-lg border rounded-lg">
        <div className="flex flex-col h-fit items-center space-y-4">
          {/* Edit/View Profile Section */}
          <div className="flex flex-col items-center">
            <fetcher.Form
              onSubmit={() => {
                validator.revalidate();
                setIsChangingImage(false);
              }}
              encType="multipart/form-data"
              method="POST"
              className="flex flex-col items-center relative"
            >
              <label htmlFor="shop-image">
                <div className="rounded-full w-44 h-44 overflow-hidden border group relative">
                  {shopImage !== undefined ? (
                    <img
                      src={previewImage}
                      className="object-cover w-full h-full "
                    />
                  ) : (
                    <img
                      src="/default_img.jpg"
                      className="object-cover w-full h-full "
                    />
                  )}
                  <div className="w-44 h-44 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="text-white" size={36} />
                  </div>
                  <input
                    id="shop-image"
                    name="image"
                    type="file"
                    className="opacity-0 absolute inset-0 "
                    onChange={handleFileChange}
                  />
                </div>
              </label>
              {isChangingImage && (
                <button
                  type="submit"
                  name="_action"
                  value="changeShopImage"
                  className="bg-sky-900 text-white px-4 py-2 rounded-lg my-4 cursor-pointer hover:bg-rose-400 active:scale-110 z-10 "
                >
                  ยืนยัน
                </button>
              )}
            </fetcher.Form>
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

          <fetcher.Form
            method="PUT"
            className="w-full space-y-6"
            onSubmit={() => {
              setIsEditing(false);
            }}
          >
            <div className="w-full space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="font-medium flex items-center gap-2"
                >
                  <Store size={16} /> Store Name
                </label>
                <input
                  disabled={!isEditing}
                  id="name"
                  name="name"
                  defaultValue={shopName}
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
                  disabled
                  value={shopAddress}
                  defaultValue={shopAddress}
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
                  disabled={!isEditing}
                  id="phone"
                  name="phone"
                  defaultValue={shopPhone}
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
                  disabled={!isEditing}
                  id="description"
                  name="description"
                  defaultValue={shopDescription}
                  rows={4}
                  className="mt-2 w-full p-2 border rounded-lg resize-none"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-center">
                <button
                  type="submit"
                  name="_action"
                  value="updateShop"
                  defaultValue="updateShop"
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            )}
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

export default ShopManagePage;
