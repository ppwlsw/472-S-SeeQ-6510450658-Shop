const BACKEND_URL: string = process.env.BACKEND_URL as string;


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

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
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
  const response = await fetch(`${BACKEND_URL}/auth/decrypt`, {
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
