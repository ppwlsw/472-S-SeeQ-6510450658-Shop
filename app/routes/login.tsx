import { Eye, EyeClosed, Store } from "lucide-react";
import { useState } from "react";
import { redirect, useFetcher, type ActionFunctionArgs } from "react-router";
import Wave from "~/components/wave";
import { requestDecryptToken, requestLogin } from "~/services/auth";
import { authCookie } from "~/services/cookie";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action: string = formData.get("_action") as string;
  if (action === "default_login") {
    formData.set("email", (formData.get("email") as string).toLowerCase());
    const error = validateInput(formData);

    if (error) {
      return error;
    }

    const response = await requestLogin({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (response.status !== 201) {
      return {
        message: "",
        error: response.error,
        status: response.status,
      };
    }

    if (response.data.role !== "SHOP") {
      return {
        message: "",
        error: "คุณไม่มีสิทธิ์เข้าใช้งาน",
        status: 403,
      };
    }

    const token: string = response.data.token;
    const user_id: string = response.data.user_id;
    const role: string = response.data.role;

    const decrypted = (await requestDecryptToken(token)).data;
    const cookie = await authCookie.serialize({
      token: decrypted,
      user_id: user_id,
      role: role,
    });

    return redirect("/home", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }
}

function validateInput(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (
    !new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(
      email as string
    )
  ) {
    return {
      message: "",
      error: "กรุณากรอกอีเมล",
      status: 400,
    };
  }
  if (!password) {
    return {
      message: "",
      error: "กรุณากรอกรหัสผ่าน",
      status: 400,
    };
  }
  return null;
}

interface InputFormProps {
  name: string;
  type: string;
  label: string;
  placeholder: string;
}

function InputForm({ name, type, label, placeholder }: InputFormProps) {
  let isPassword = type === "password";
  let [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col relative [&:has(input:focus)>label]:opacity-100 w-full">
      <label
        className="opacity-0 absolute -top-5 left-10 bg-white-smoke p-1"
        htmlFor={name}
      >
        {label}
      </label>

      {isPassword && showPassword && (
        <Eye
          className="absolute right-8 top-8 text-gray-500"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        />
      )}

      {isPassword && !showPassword && (
        <EyeClosed
          className="absolute right-8 top-8 text-gray-500"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        />
      )}

      <input
        className="border border-gray-300 p-6 rounded-full focus:border-primary-dark 
                  focus:outline-none focus:placeholder:opacity-0 w-full"
        type={showPassword && isPassword ? "text" : type}
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </div>
  );
}

interface ActionMessage {
  message: string;
  error: string;
  status: number;
}

function LoginFetcherForm() {
  const fetcher = useFetcher<ActionMessage>();
  return (
    <fetcher.Form
      method="POST"
      className="flex flex-col justify-start items-center w-full text-lg"
    >
      <div className="flex flex-col justify-evenly items-center w-full gap-12">
        <InputForm name="email" type="text" label="อีเมล" placeholder="อีเมล" />

        <InputForm
          name="password"
          type="password"
          label="รหัสผ่าน"
          placeholder="รหัสผ่าน"
        />

        <button
          name="_action"
          value="default_login"
          type="submit"
          className="bg-nature-blue text-white-smoke text-2xl font-bold p-6 rounded-full w-full"
        >
          เข้าสู่ระบบ
        </button>
        <p
          className={`w-full text-red-500 text-center border border-red-500 bg-red-100 p-1 rounded-md ${
            fetcher.data?.error ? "opacity-100" : "opacity-0"
          }`}
        >
          {fetcher.data?.error ? fetcher.data.error : "error"}
        </p>
      </div>
    </fetcher.Form>
  );
}

export default function Login() {
  return (
    <div className="flex flex-col h-svh w-svw justify-start items-center bg-white-smoke text-obsidian p-20 pt-0 overflow-hidden">
      <Wave />
      <div className="h-fit">
        <img src="/seeq-logo.png" alt="seeq-logo" className="h-48" />
      </div>

      <div className="flex flex-row bg-white-smoke w-full drop-shadow-3xl rounded-lg p-3 pt-20 pb-20">
        <div className="flex justify-center items-center w-full border-r-[0.1px] border-gray-300">
          <img src="/login-shop-logo.png" alt="admin-logo" className="w-2/3" />
        </div>
        <div className="flex flex-col justify-center w-full border-l-[0.1px] border-gray-300 pl-28 pr-28">
          <p className="flex flex-row  items-center text-4xl mb-6 gap-3">
            <span className="inline-flex border-t-4 pt-4 border-nature-blue">
              เข้าสู่ระบบ
            </span>
            <span className="inline-flex border-t-4 pt-4 border-white-smoke">
              ร้านค้า
            </span>
            <div className="pt-4 border-white-smoke">
              <Store size={36} />
            </div>
          </p>
          <div className="w-full mt-8">
            <LoginFetcherForm />
          </div>
        </div>
      </div>
    </div>
  );
}
