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
  Eye,
  EyeOff,
  CheckCircle,
  LogOut,
} from "lucide-react";
import {
  redirect,
  useFetcher,
  useLoaderData,
  useRevalidator,
  type ActionFunctionArgs,
} from "react-router";
import { shop_provider } from "~/provider/provider";
import {
  changeshopAvatar,
  changeShopOpenStatus,
  fetchingShopData,
  updateShop,
  type UpdateShopRequest,
} from "~/repositories/shop-api";
import Swal from "sweetalert2";
import { ChangePasswordModal } from "~/components/change-password-modal";
import { useAuth } from "~/utils/auth";

export async function loader({ request }: ActionFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });

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
  const { getCookie } = useAuth;
  const data = await getCookie({ request });

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

    case "changePassword":
      // Handle password change logic here
      // For now just simulating success
      return { success: true };
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
      title: shop.is_open ? "ต้องการ ปิดร้าน?" : "ต้องการ เปิดร้าน?",
      text: shop.is_open
        ? "คุณต้องการปิดร้านใช่หรือไม่?"
        : "คุณต้องการเปิดร้านใช่หรือไม่?",
      icon: "warning",
      customClass: {
        confirmButton: "order-2",
        cancelButton: "order-1",
      },
      showCancelButton: true,
      confirmButtonColor: shop.is_open ? "#d33" : "#08db0f",
      cancelButtonColor: "#6b7280",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: shop.is_open ? "ใช่, ปิดร้านเลย" : "ใช่, เปิดร้านเลย!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetcher.submit({ _action: "shopStatus" }, { method: "PUT" });
        Swal.fire(
          "สำเร็จ!",
          shop.is_open
            ? "ปิดร้านของคุณเรียบร้อยแล้ว."
            : "เปิดร้านของคุณเรียบร้อยแล้ว.",
          "success"
        );
      }
    });
  };

  const validator = useRevalidator();
  const [previewImage, setPreviewImage] = useState(shopImage);

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setIsChangingImage(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Header */}
      <div className="bg-white shadow-md py-6 px-8 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Store className="text-blue-600" size={24} />
            จัดการร้านค้า
          </h1>

          <div className="flex items-center gap-3">
            <fetcher.Form method="PUT" className="flex items-center gap-4">
              <span className="font-medium flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                {shop.is_open ? (
                  <Store className="text-green-500" size={18} />
                ) : (
                  <XCircle className="text-red-500" size={18} />
                )}
                <span
                  className={shop.is_open ? "text-green-700" : "text-red-700"}
                >
                  {shop.is_open ? "เปิดร้านค้า" : "ปิดร้าน"}
                </span>
              </span>
              <button
                type="submit"
                onClick={handleShopStatusChange}
                name="_action"
                value="shopStatus"
                className={`px-4 py-2 rounded-lg text-white cursor-pointer shadow-sm transition-all duration-200 ${
                  shop.is_open
                    ? "bg-red-500 hover:bg-red-600 hover:shadow-md"
                    : "bg-green-500 hover:bg-green-600 hover:shadow-md"
                }`}
              >
                {shop.is_open ? "ปิดร้านค้า" : "เปิดร้านค้า"}
              </button>
            </fetcher.Form>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Shop Banner */}
          <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div className="absolute -bottom-16 left-8">
              <fetcher.Form
                onSubmit={() => {
                  validator.revalidate();
                  setIsChangingImage(false);
                }}
                encType="multipart/form-data"
                method="POST"
                className="relative"
              >
                <label htmlFor="shop-image">
                  <div className="rounded-full w-32 h-32 overflow-hidden border-4 border-white shadow-lg group relative cursor-pointer">
                    {shopImage !== undefined ? (
                      <img
                        src={previewImage}
                        className="object-cover w-full h-full"
                        alt="Shop profile"
                      />
                    ) : (
                      <img
                        src="/default_img.jpg"
                        className="object-cover w-full h-full"
                        alt="Default shop profile"
                      />
                    )}
                    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={28} />
                    </div>
                    <input
                      id="shop-image"
                      name="image"
                      type="file"
                      className="opacity-0 absolute inset-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
                {isChangingImage && (
                  <button
                    type="submit"
                    name="_action"
                    value="changeShopImage"
                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
              </fetcher.Form>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-end gap-3 mb-6">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center gap-2 transition duration-200"
              >
                <Lock size={16} />
                เปลี่ยนรหัสผ่าน
              </button>

              <button
                type="button"
                onClick={handleEditButton}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200 ${
                  isEditing
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isEditing ? (
                  <>
                    <XCircle size={16} /> ยกเลิก
                  </>
                ) : (
                  <>
                    <Pencil size={16} /> แก้ไขโปรไฟล์
                  </>
                )}
              </button>
            </div>

            <fetcher.Form
              method="PUT"
              className="space-y-6"
              onSubmit={() => {
                setIsEditing(false);
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="font-medium flex items-center gap-2 text-gray-700 mb-2"
                  >
                    <Store size={16} className="text-blue-600" /> ชื่อร้านค้า
                  </label>
                  <input
                    disabled={!isEditing}
                    id="name"
                    name="name"
                    defaultValue={shopName}
                    className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 ${
                      isEditing ? "bg-white" : "bg-gray-50 text-gray-700"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="font-medium flex items-center gap-2 text-gray-700 mb-2"
                  >
                    <Phone size={16} className="text-blue-600" />{" "}
                    หมายเลขโทรศัพท์
                  </label>
                  <input
                    disabled={!isEditing}
                    id="phone"
                    name="phone"
                    defaultValue={shopPhone}
                    className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 ${
                      isEditing ? "bg-white" : "bg-gray-50 text-gray-700"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="font-medium flex items-center gap-2 text-gray-700 mb-2"
                >
                  <MapPin size={16} className="text-blue-600" /> ที่ิอยู่
                </label>
                <input
                  id="address"
                  name="address"
                  disabled
                  value={shopAddress}
                  defaultValue={shopAddress}
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="font-medium flex items-center gap-2 text-gray-700 mb-2"
                >
                  <FileText size={16} className="text-blue-600" /> รายละเอียด
                </label>
                <textarea
                  disabled={!isEditing}
                  id="description"
                  name="description"
                  defaultValue={shopDescription}
                  rows={4}
                  className={`w-full p-3 border rounded-lg resize-none focus:ring focus:ring-blue-200 ${
                    isEditing ? "bg-white" : "bg-gray-50 text-gray-700"
                  }`}
                />
              </div>

              {isEditing && (
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    name="_action"
                    value="updateShop"
                    className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition duration-200 shadow-md hover:shadow-lg"
                  >
                    <Save size={18} /> บันทึกการเปลี่ยนแปลง
                  </button>
                </div>
              )}
            </fetcher.Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopManagePage;
