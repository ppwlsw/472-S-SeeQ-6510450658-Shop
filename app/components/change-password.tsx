import { useState } from "react";

function ChangePasswordModal({ isOpen, onClose }: any) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    // Handle password change logic here
    console.log("Password changed successfully");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className=" bg-black z-20 bg-opacity-20 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded mt-1"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded mt-1"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
