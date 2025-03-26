import { useFetcher, type ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2,
} from "lucide-react";
import { sendResetPasswordRequest } from "~/repositories/auth.repository";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ActionMessage {
  message?: string;
  status?: number;
  success: boolean;
  error?: Record<string, string[]>;
  value?: ResetPasswordFormData;
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionMessage> {
  const form = await request.formData();
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const set = {
    email: form.get("email") as string,
    password: form.get("password") as string,
    confirmPassword: form.get("confirmPassword") as string,
    token: token || "",
  };

  const payload = resetPasswordSchema.safeParse(set);

  if (!payload.success) {
    return {
      success: false,
      error: payload.error.flatten().fieldErrors,
      value: set,
    };
  }

  try {
    const success = await sendResetPasswordRequest(request, set);
    if (!success)
      throw Error(
        "ไม่สามารถรีเซ็ทรหัสผ่านได้อาจเป็นเพราะ token ไม่ถูกต้องหรือหมดอายุแล้ว"
      );

    return {
      success: true,
      message: "Password reset successfully!",
    };
  } catch (e) {
    return {
      success: false,
      error: { general: [(e as Error).message] },
    };
  }
}

function ResetPasswordPage() {
  const fetcher = useFetcher<ActionMessage>();
  const errors = fetcher.data?.error || {};
  const isSuccess = fetcher.data?.success;
  const successMessage = fetcher.data?.message;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const updatePasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const getPasswordStrengthPercentage = () => {
    const criteria = Object.values(passwordStrength);
    const metCriteria = criteria.filter(Boolean).length;
    return (metCriteria / criteria.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">แก้ไขรหัสผ่าน</h2>
          <p className="text-blue-100 text-center mt-2">
            กรุณากรอกรหัสผ่านใหม่ตามเงื่อนไขที่กำหนด
          </p>
        </div>

        {fetcher.data?.success ? (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                รหัสผ่านถูกแก้ไขเรียบร้อย!
              </h3>
              <p className="text-gray-600">
                รหัสผ่านใหม่ของคุณถูกอัพเดทในระบบเรียบร้อยแล้ว ตอนนี้คุณสามารถ
                Login ด้วยรหัสใหม่ได้แล้ว.
              </p>
              <a
                href="/login"
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                ไปที่หน้า Login
              </a>
            </div>
          </div>
        ) : (
          <fetcher.Form method="post" className="p-8 space-y-6">
            {errors?.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                <span className="text-red-800 text-sm">
                  {errors.general[0]}
                </span>
              </div>
            )}

            {fetcher.state === "submitting" && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={fetcher.data?.value?.email || ""}
                placeholder="กรุณากรอกอีเมลของคุณที่นี่"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              />
              {errors?.email?.[0] && (
                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="กรุณากรอกรหัสผ่านใหม่ของคุณที่นี่"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out pr-10"
                  onChange={(e) => updatePasswordStrength(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors?.password?.[0] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    getPasswordStrengthPercentage() <= 20
                      ? "bg-red-500"
                      : getPasswordStrengthPercentage() <= 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${getPasswordStrengthPercentage()}%` }}
                ></div>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                <li className="flex items-center space-x-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.length
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.length ? "✓" : ""}
                  </span>
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center space-x-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.uppercase
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.uppercase ? "✓" : ""}
                  </span>
                  <span>Uppercase letter</span>
                </li>
                <li className="flex items-center space-x-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.lowercase
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.lowercase ? "✓" : ""}
                  </span>
                  <span>Lowercase letter</span>
                </li>
                <li className="flex items-center space-x-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.number
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.number ? "✓" : ""}
                  </span>
                  <span>Number</span>
                </li>
                <li className="flex items-center space-x-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.special
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.special ? "✓" : ""}
                  </span>
                  <span>Special character</span>
                </li>
              </ul>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="กรุณากรอกรหัสผ่านใหม่อีกครั้ง"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors?.confirmPassword?.[0] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={fetcher.state === "submitting"}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {fetcher.state === "submitting"
                ? "Processing..."
                : "Reset Password"}
            </button>
          </fetcher.Form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
