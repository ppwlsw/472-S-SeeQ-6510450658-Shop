import type { QueueType } from "~/repositories/queues-api";
import { Utensils, Users, Tag, Edit, Trash2, X } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import Swal from "sweetalert2";

export default function QueueTypeCard({ queueType }: { queueType: QueueType }) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const validator = useRevalidator();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({ ...queueType });

  const handleClick = () => {
    navigate(`/merchant/queue/${queueType.id}`);
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-95 cursor-pointer transition duration-150 ease-in-out w-80 relative"
      role="button"
      tabIndex={0} // Adds keyboard accessibility
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="w-full flex justify-center mb-4">
        {queueType.image_url ? (
          <img
            src={queueType.image_url}
            alt={queueType.name}
            className="w-20 h-20 object-cover rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full border border-gray-300">
            <Utensils className="w-10 h-10 text-gray-500" />
          </div>
        )}
      </div>

      {/* Queue Info */}
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {queueType.name}
      </h2>
      <p className="text-sm text-gray-500 text-center">
        {queueType.description}
      </p>

      {/* Status Badge */}
      <div className="flex justify-center mt-3">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            queueType.is_available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {queueType.is_available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1 text-gray-500" />
          <span>{queueType.queue_counter} in queue</span>
        </div>
        <div className="flex items-center">
          <Tag className="w-4 h-4 mr-1 text-gray-500" />
          <span>Tag: {queueType.tag}</span>
        </div>
      </div>

      {/* Edit & Delete Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
        >
          <Edit size={20} />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            Swal.fire({
              title: "คุณต้องการลบประเภทของคิวนี้ ใช่ไหม?",
              text: "คุณจะไม่สามารถย้อนกลับได้นะ!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "ใช่, ลบเลย!",
              cancelButtonText: "ยกเลิก",
              customClass: {
                confirmButton: "order-2",
                cancelButton: "order-1",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                const formData = new FormData();
                formData.append("queue_id", queueType.id.toString());
                formData.append("_action", "deleteQueueType");
                fetcher.submit(formData, { method: "DELETE" });
              }
              validator.revalidate();
            });
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-1-">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Queue Type</h2>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <fetcher.Form
              method="POST"
              onSubmit={() => setIsEditModalOpen(false)}
            >
              <input type="hidden" name="queue_id" value={queueType.id} />
              <div className="space-y-2">
                <label className="block text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={editedData.description}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-md"
                  required
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Tag</label>
                <input
                  type="text"
                  name="tag"
                  value={editedData.tag}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  name="_action"
                  value="editQueueType"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      )}
    </div>
  );
}
