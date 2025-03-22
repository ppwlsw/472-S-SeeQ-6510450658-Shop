import { createCookie, redirect, type Cookie } from "react-router";

const API_BASE_URL: string = process.env.API_BASE_URL as string;
const ENV: string = process.env.ENV as string;

interface ResponseMessageProps {
  data: {
    [key: string]: any;
  };
  error: string;
  status: number;
}

interface LoginProps {
  email: string;
  password: string;
}

export async function requestLogin(
  loginProps: LoginProps
): Promise<ResponseMessageProps> {
  const formData = new FormData();
  formData.set("email", loginProps.email);
  formData.set("password", loginProps.password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
   return {
    status: response.status,
    data: response.status === 201 ? json.data: {},
    error:
      response.status === 201
        ? ""
        : response.status === 404
        ? "ไม่พบข้อมูลหรือยังไม่ได้ยืนยันอีเมล"
        : response.status === 401
        ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        : "เกิดข้อผิดพลาด",
  };
}

export async function requestDecryptToken(
  token: string
): Promise<ResponseMessageProps> {
  const formData = new FormData();
  formData.set("encrypted", token);
  const response = await fetch(`${API_BASE_URL}/auth/decrypt`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  return {
    data: json.data,
    status: response.status,
    error: response.status === 500 ? "เกิดข้อผิดพลาด" : "",
  };
}

export const authCookie: Cookie = createCookie("auth_shop", {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24,

  httpOnly: ENV !== "PRODUCTION",
  secure: ENV === "PRODUCTION",
  secrets: [API_BASE_URL]
});

interface AuthCookieProps {
  token: string;
  user_id: number;
  role: string;
}

async function getAuthCookie({ request }: { request: Request }): Promise<AuthCookieProps> {
  const cookie: AuthCookieProps = await authCookie.parse(request.headers.get("Cookie"));
  return cookie;
}

async function validate({ request }: { request: Request}): Promise<boolean> {
  const isAuthCookieValid = await validateAuthCookie({ request });
  return isAuthCookieValid;
}

async function validateAuthCookie({ request }: { request: Request}): Promise<boolean> {
  const cookie: AuthCookieProps = await authCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    throw redirect("/login")
  }
  return true
}

interface useAuthProps {
  logout: (token: string) => Promise<ResponseMessageProps>,
  getCookie: ({ request }: { request: Request }) => Promise<AuthCookieProps>,
  validate: ({ request }: { request: Request }) => Promise<boolean>,
}

async function logout(token: string):  Promise<ResponseMessageProps>{
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    method: "POST",
  });
  return {
    data: {},
    status: response.status,
    error: response.status != 204 ? "เกิดข้อผิดพลาด" : ""
  }
}

export const useAuth: useAuthProps = {
  getCookie: getAuthCookie,
  validate: validate,
  logout: logout
}
