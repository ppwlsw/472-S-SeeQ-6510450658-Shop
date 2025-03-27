import { Outlet, Link, useLocation } from "react-router";
import {
  ChartSpline,
  UsersRound,
  Pencil,
  Bell,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { SidebarItem } from "~/components/sidebar-item";

import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { shop_provider } from "~/provider/provider";
import { fetchingShopData } from "~/repositories/shop-api";
import { useAuth } from "~/utils/auth";
import { useState } from "react";
import { LogoutModal } from "~/components/logout-modal";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie, validate } = useAuth;
  await validate({ request });
  const data = await getCookie({ request });
  const user_id = data.user_id;
  const role = data.role;

  if (role !== "SHOP") {
    return redirect("/login");
  }

  try {
    await fetchingShopData(user_id, request);
  } catch (error) {
    console.error(error);
  }

  return { shop: shop_provider[user_id] };
}

const MerchantNav = () => {
  const location = useLocation();

  const getCurrentPageTitle = () => {
    if (location.pathname.startsWith("/merchant/dashboard")) {
      return "ภาพรวมร้านค้า";
    } else if (location.pathname.startsWith("/merchant/queue")) {
      return "จัดการคิว";
    } else if (location.pathname.startsWith("/merchant/store-management")) {
      return "จัดการร้านค้า";
    } else if (location.pathname.startsWith("/merchant/reminders")) {
      return "การแจ้งเตือน";
    } else if (location.pathname.startsWith("/merchant/items")) {
      return "รายการสินค้า";
    } else {
      return "ภาพรวมร้านค้า";
    }
  };

  const { shop } = useLoaderData<typeof loader>();
  const [isPoping, setIsPoping] = useState<boolean>(false);

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      {/* Sidebar - Fixed width with full height and scrollable content */}
      <nav className="w-64 border-r border-gray-200 flex flex-col overflow-hidden">
        <section
          id="header"
          className="h-fit flex flex-row items-center p-4 border-b-[1px] border-gray-200 flex-shrink-0"
        >
          <iframe src="/merchant-logo.svg" className="w-11 h-10" />
          <div className="text-xl font-bold">SeeQ-Merchant</div>
        </section>

        {/* Scrollable sidebar content */}
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          <section id="items" className="flex flex-col">
            <div className="flex flex-col gap-8">
              <label htmlFor="dashboard-items">
                <h1 className="mx-4 mt-8 font-bold text-gray-500">Home</h1>
              </label>
              <SidebarItem
                icon={<ChartSpline className="w-5 h-5" />}
                label="ภาพรวมร้านค้า"
                paths={["/merchant/dashboard"]}
              />
              <SidebarItem
                icon={<UsersRound className="w-5 h-5" />}
                label="จัดการคิว"
                paths={["/merchant/queue-manage", "/merchant/queue"]}
              />
              <SidebarItem
                icon={<Bell className="w-5 h-5" />}
                label="การแจ้งเตือน"
                paths={["/merchant/reminders"]}
              />
              <SidebarItem
                icon={<ShoppingCart className="w-5 h-5" />}
                label="รายการสินค้า"
                paths={["/merchant/items"]}
              />
            </div>

            <div className="flex flex-col mb-4 gap-3 mt-auto">
              <label htmlFor="manage-store">
                <h1 className="mx-2 mt-4 p-4 font-bold text-gray-500 border-b-[1px] border-gray-200 mb-4">
                  Setting
                </h1>
              </label>
              <SidebarItem
                icon={<Pencil className="w-5 h-5" />}
                label="จัดการร้านค้า"
                paths={["/merchant/store-management"]}
              />
              <LogoutModal isPoping={isPoping} setIsPoping={setIsPoping} />
              <button
                className="flex flex-row justify-start items-center px-6 py-2 mx-4 gap-4 border-[1px] border-transparent hover:text-red-600 hover:border-red-600 hover:scale-105 duration-300 rounded-md"
                onClick={() => {
                  setIsPoping(true);
                }}
              >
                <LogOut className="w-5 h-5" />
                <p>ออกจากระบบ</p>
              </button>
            </div>
          </section>
        </div>
      </nav>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar - Fixed height */}
        <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between bg-white flex-shrink-0">
          <h1 className="text-xl font-semibold">{getCurrentPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-[1px] overflow-hidden">
                {shop?.image_url ? (
                  <img
                    src={shop?.image_url}
                    className="object-cover w-full h-full "
                  />
                ) : (
                  <img
                    src="/default_img.jpg"
                    className="object-cover w-full h-full "
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{shop?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MerchantNav;
