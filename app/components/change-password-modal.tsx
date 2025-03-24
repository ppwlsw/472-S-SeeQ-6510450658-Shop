import { useState, useEffect } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "~/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { useFetcher } from "react-router";
import Swal from "sweetalert2";

function ChangePasswordModal({ isOpen, onClose }: any) {
  const fetcher = useFetcher();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log("Fetch Response:", fetcher.data); // Debugging

    if (fetcher.state === "idle" && fetcher.data) {
      const { code, data } = fetcher.data;
      if (code === 500) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: data, // Message from API
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      } else {
        Swal.fire({
          title: "สำเร็จ!",
          text: "รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
        onClose();
      }
    }
  }, [fetcher.data, fetcher.state, onClose]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    console.log("Submitting Password Change..."); // Debugging

    fetcher.submit(
      {
        _action: "changePassword",
        new_password: newPassword,
      },
      { method: "POST" }
    );

    console.log("fetcher.submit() executed!"); // Check if it runs
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogContent className="fixed top-1/4 left-1/2 transform -translate-x-1/2 p-6 bg-white rounded-lg shadow-lg w-96">
        <DialogHeader>
          <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              รหัสผ่านใหม่
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordModal;
