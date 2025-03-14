import { Outlet, Link, useLocation } from "react-router";
import { ChartSpline, UsersRound, Pencil, Bell, Store } from "lucide-react";
import { SidebarItem } from "~/components/sidebar-item";

import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { shop_provider } from "~/provider/provider";
import { fetchingShopData } from "~/repositories/shop-api";
import { getAuthCookie } from "~/services/cookie";

export async function loader({ request }: LoaderFunctionArgs) {
  const data = await getAuthCookie({ request });
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
    } else {
      return "ภาพรวมร้านค้า";
    }
  };

  const { shop } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-row h-screen">
      {/* Sidebar */}
      <nav className="w-64 border-r border-gray-200 flex flex-col">
        <section
          id="header"
          className="h-fit flex flex-row items-center p-4 border-b-[1px] border-gray-200"
        >
          <iframe src="/merchant-logo.svg" className="w-11 h-10" />
          <div className="text-xl font-bold">SeeQ-Merchant</div>
        </section>
        <section id="items" className="flex flex-col justify-between h-full">
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

            <div className="flex flex-col mb-4">
              <SidebarItem
                icon={<Bell className="w-5 h-5" />}
                label="การแจ้งเตือน"
                paths={["/merchant/reminders"]}
              />
            </div>
          </div>

          <div className="flex flex-col mb-4">
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
          </div>
        </section>
      </nav>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between bg-white">
          <h1 className="text-xl font-semibold">{getCurrentPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-[1px] overflow-hidden">
                {shop.image_url !== undefined ? (
                  <img
                    src={shop.image_url}
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
                <span className="text-sm font-medium">{shop.name}</span>
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MerchantNav;
