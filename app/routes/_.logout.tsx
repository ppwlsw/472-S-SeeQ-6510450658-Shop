import { redirect, type LoaderFunctionArgs } from "react-router";
import { authCookie, useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie, logout } = useAuth;
  const cookie = await getCookie({ request });
  logout(cookie.token);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await authCookie.serialize(null, {
        expires: new Date(0),
        maxAge: 0,
      }),
    },
  });
}

function LoadingModal() {
  return (
    <div className="absolute z-50 top-0 flex flex-col justify-center items-center w-full h-full text-obsidian">
      <div className="relative w-full h-full bg-obsidian opacity-25"></div>
      <div className="flex flex-col justify-center items-center gap-3 absolute rounded-lg shadow-lg bg-white-smoke p-6">
        <span className="w-[20px] h-[20px] border-4 border-gray-400 rounded-full border-t-white-smoke animate-spin"></span>
        <p className="text-xl text-obsidian">กำลังโหลด...</p>
      </div>
    </div>
  );
}

export default function Logout() {
  return (
    <div className="flex flex-col justify-center items-center h-svh w-svw bg-white-smoke relative overflow-hidden">
      <LoadingModal />
    </div>
  );
}
