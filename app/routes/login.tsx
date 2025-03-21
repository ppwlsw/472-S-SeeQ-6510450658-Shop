import { CircleX, Eye, EyeClosed, Store } from "lucide-react";
import { useState } from "react";
import { redirect, useFetcher, type ActionFunctionArgs } from "react-router";
import Wave from "~/components/wave";
import { requestDecryptToken, requestLogin } from "~/utils/auth";
import { authCookie, type AuthCookieProps } from "~/utils/cookie";
import { motion } from "framer-motion";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action: string = formData.get("_action") as string;

  if (action === "reset") {
    return null;
  }

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
    const user_id: number = response.data.id;
    const role: string = response.data.role;

    const decrypted = (await requestDecryptToken(token)).data.plain_text as string;
    const cookie = await authCookie.serialize({
      token: decrypted,
      user_id: user_id,
      role: role,
    } as AuthCookieProps);

    return redirect("/merchant/dashboard", {
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
  const fetcher = useFetcher({
    key: "LoginFetcher",
  });
  return (
    <fetcher.Form
      method="POST"
      className="flex flex-col justify-start items-center w-full"
    >
      <div className="flex flex-col justify-evenly items-center w-full gap-8">
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
          className="bg-nature-blue text-white-smoke border-2 text-2xl font-bold p-6 rounded-full w-full transition-all duration-300 hover:bg-white-smoke hover:text-nature-blue hover:border-2 hover:border-nature-blue hover:cursor-pointer"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </fetcher.Form>
  );
}

function LoginModal({ fetcherKey }: {fetcherKey: string}) {
  const fetcher = useFetcher<ActionMessage>({
    key: fetcherKey,
  });
  return (
    <motion.div
      initial={{ opacity: 0, display: "none" }}
      animate={{
        opacity: 1,
        display:
          fetcher.formData?.get("_action") != "reset" &&
          (fetcher.state === "submitting" || fetcher.data?.error != undefined)
            ? "flex"
            : "none",
        transition: {
          duration: fetcher.formData?.get("_action") != "reset" ? 1 : 0,
          ease: "easeIn",
        },
      }}
      className="absolute z-50 top-0 flex flex-col justify-center items-center w-full h-full text-obsidian"
      onClick={() => {
        fetcher.submit(
          {
            _action: "reset",
          },
          {
            method: "POST",
          }
        );
      }}
    >
      <div className="relative w-full h-full bg-obsidian opacity-25"></div>
      <div className="flex flex-col justify-center items-center gap-3 absolute rounded-lg shadow-lg bg-white-smoke p-6">
        {fetcher.data?.error == undefined ? (
          <span className="inline-block w-[20px] h-[20px] border-4 border-gray-400 rounded-full border-t-white-smoke animate-spin"></span>
        ) : (
          <motion.div
            initial={{
              rotate: 90,
            }}
            animate={{
              rotate: 0,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          >
            <CircleX size={36} color="#F44336" />
          </motion.div>
        )}
        <motion.p
          animate={{
            opacity: 1,
            color: fetcher.data?.error != undefined ? "#F44336" : "#0b1215",
            transition: { duration: 0.3, ease: "easeIn" },
          }}
          className="text-xl text-obsidian"
        >
          {fetcher.data?.error != undefined
            ? fetcher.data.error
            : "กำลังโหลด..."}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Login() {
  return (
    <div className="flex flex-col h-svh w-svw bg-white-smoke relative overflow-hidden">
      {/* Main content */}
      <div className="flex flex-col h-full w-full justify-center items-center text-obsidian p-20 z-10">
        <div className="flex max-lg:flex-col flex-row bg-white-smoke w-full h-full drop-shadow-3xl rounded-lg p-10">
          <div className="flex flex-col justify-center items-center max-lg:h-2/5 w-full lg:border-r-[0.1px] border-gray-300">
            <img
              src="/shop-logo.png"
              alt="shop-logo"
              className="h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center max-lg:h-3/5 w-full lg:border-l-[0.1px] border-gray-300 p-10 pt-0 pb-0 lg:gap-8">
            <p className="flex flex-row items-center text-4xl">
              <span className="border-t-4 border-nature-blue pt-2">เข้าสู่ระบบ</span>
              <span className="border-t-4 border-white-smoke pt-2">ร้านค้า</span>
              <div className="border-t-4 border-white-smoke pt-2">
                <Store size={36} />
              </div> 
            </p>
            <div className="w-full mt-8">
              <LoginFetcherForm />
            </div>
          </div>
        </div>
      </div>

      {/* Wave at the bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <Wave />
      </div>

      {/* Loading */}
      <LoginModal fetcherKey="LoginFetcher"/>

    </div>
  );
}
