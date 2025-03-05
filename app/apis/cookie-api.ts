import { redirect } from "react-router";
import { authCookie } from "~/services/cookie";

async function getCookie(request: Request){
    const cookie = request.headers.get("cookie");
    const data = await authCookie.parse(cookie);
    if (!data) {
      return redirect("/login");
    }
    return data;
}

async function getToken(request: Request){
  const cookie = request.headers.get("cookie");
  const data = await authCookie.parse(cookie);
  if (!data) {
    return redirect("/login");
  }
  const token = data.token.plain_text;
  return token;
}

export { getCookie , getToken};