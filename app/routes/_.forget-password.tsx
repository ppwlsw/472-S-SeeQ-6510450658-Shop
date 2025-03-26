import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { useEffect } from "react";
import {
  Link,
  redirect,
  useFetcher,
  useNavigate,
  type ActionFunctionArgs,
} from "react-router";
import { z } from "zod";
import { sendForgetPasswordRequest } from "~/repositories/auth.repository";

const ForgetPasswordSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
});

type ForgetPasswordFormData = z.infer<typeof ForgetPasswordSchema>;

interface ActionMessage {
  success: boolean;
  status?: number;
  message?: string;
  error?: Record<string, string[]>;
  value?: ForgetPasswordFormData;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const set = {
    email: form.get("email") as string,
  };

  const payload = ForgetPasswordSchema.safeParse(set);

  if (!payload.success) {
    return {
      success: false,
      error: payload.error.flatten().fieldErrors,
    };
  }

  try {
    const success = await sendForgetPasswordRequest(
      request,
      payload.data.email
    );
    if (!success) throw Error("ส่งคำขอไม่สำเร็จ");

    const timer = setTimeout(() => {
      redirect("/");
    }, 2000);

    () => clearTimeout(timer);

    return {
      success: true,
      message: "คำขอของคุณถูกส่งไปที่ระบบของเราเรียบร้อยแล้ว!",
    };
  } catch (e) {
    return {
      success: false,
      error: { general: [(e as Error).message] },
    };
  }
}

function ForgetPasswordPage() {
  const navigate = useNavigate();
  const fetcher = useFetcher<ActionMessage>();
  const errors = fetcher.data?.error || {};
  const isSuccess = fetcher.data?.success;
  const successMessage = fetcher.data?.message;

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen px-10">
      <div className="absolute top-0 w-full">
        <Link to="/login">
          <ArrowLeft
            className="absolute text-black left-4 top-9 transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
            width={30}
            height={30}
          />
        </Link>
      </div>
      <div className="border-2 border-black mb-3 rounded-full p-6">
        <LockKeyhole width={80} height={80} />
      </div>
      <h5 className="font-bold mb-2">มีปัญหากับการ Login รึป่าว?</h5>
      <p className="text-gray-500 text-center mx-3">
        กรุณากรอกอีเมลของคุณเพื่อให้ระบบส่งอีเมลสำหรับแก้ไขรหัสผ่านไปให้คุณและตรวจสอบให้แน่ใจว่าไม่ใช่อีเมลปลอม
      </p>

      {isSuccess ? (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg w-full max-w-sm">
          {successMessage}
        </div>
      ) : (
        <fetcher.Form method="post" className="w-full max-w-sm mt-4 mb-10">
          <div className="flex flex-col w-full">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="กรุณากรอกอีเมลของคุณที่นี่"
              className="border border-gray-500 w-full px-3 py-2 rounded-lg"
            />
            {errors?.email?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          {errors?.general?.[0] && (
            <p className="mt-1 text-sm text-red-600">{errors.general[0]}</p>
          )}

          {fetcher.state === "submitting" ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : (
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4">
              ส่ง
            </button>
          )}
        </fetcher.Form>
      )}

      <div className="absolute bottom-0 w-full">
        <Link
          to="/login"
          className="block w-full bg-gray-800 hover:bg-blue-600 text-white font-semibold py-4 px-4 mt-4 text-center"
        >
          กลับไปที่หน้าเข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}

export default ForgetPasswordPage;
