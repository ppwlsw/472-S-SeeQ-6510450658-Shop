import { createCookie, type Cookie } from "react-router";

const ENV: string = process.env.ENV as string;
const APP_URL: string = process.env.APP_URL as string;

export const authCookie: Cookie = createCookie("auth", {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24,

  httpOnly: ENV !== "PRODUCTION",
  secure: ENV === "PRODUCTION",
  secrets: [APP_URL]
});
