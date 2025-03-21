import { EyeOff, XCircle, Lock, CheckCircle, Eye } from "lucide-react";
import { useState } from "react";
import { useFetcher } from "react-router";

export function ChangePasswordModal({ isOpen, onClose }: any) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fetcher = useFetcher();

  if (!isOpen) return null;

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      onClose();
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XCircle size={24} />
        </button>

        <div className="mb-6 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
          <p className="text-gray-600 mt-1">Update your account password</p>
        </div>

        {success ? (
          <div className="bg-green-100 p-4 rounded-lg flex items-center gap-3 mb-4">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-800">
              Password updated successfully!
            </span>
          </div>
        ) : (
          <fetcher.Form
            onSubmit={() => {
              handleSubmit;
              setPasswordVisible(!passwordVisible);
            }}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-100 p-3 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                />
                <button
                  type="submit"
                  name="_action"
                  value="changePassword"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                >
                  {newPasswordVisible ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  {confirmPasswordVisible ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Update Password
              </button>
            </div>
          </fetcher.Form>
        )}
      </div>
    </div>
  );
}
