import { createCookie, type Cookie } from "react-router";

const ENV: string = process.env.ENV as string;
const BACKEND_URL: string = process.env.BACKEND_URL as string;

export const authCookie: Cookie = createCookie("auth", {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24,

  httpOnly: ENV !== "PRODUCTION",
  secure: ENV === "PRODUCTION",
  secrets: [BACKEND_URL]
});
