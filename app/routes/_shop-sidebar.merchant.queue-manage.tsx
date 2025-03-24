import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  redirect,
  useFetcher,
  useLoaderData,
  useRevalidator,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import QueueTypeCard from "~/components/queue-type-card";
import { queue_provider, shop_provider } from "~/provider/provider";
import {
  createQueueType,
  deleteQueueType,
  fetchingQueuesType,
  updateQueueType,
} from "~/repositories/queues-api";
import { useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });

  const user_id = data.user_id;
  const shop_id = shop_provider[user_id]?.id;

  // ตรวจสอบว่า queue_provider สำหรับ shop_id นั้นมีข้อมูลหรือยัง
  if (!queue_provider[shop_id] || queue_provider[shop_id].length === 0) {
    try {
      await fetchingQueuesType(request, shop_id); // ดึงข้อมูลจาก API
    } catch (e) {
      console.error(e);
    }
  }

  const queuesType = queue_provider[shop_id];

  return { queuesType: queuesType, shop_id: shop_id };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const { getCookie } = useAuth;
  const data = await getCookie({ request });
  const user_id = data.user_id;
  const queue_id = parseInt(formData.get("queue_id") as string);
  const shop_id = shop_provider[user_id].id;

  if (!data) return redirect("/login");

  switch (action) {
    case "createQueueType":
      await createQueueType(request, formData);
      break;
    case "deleteQueueType":
      await deleteQueueType(request, queue_id, shop_id);
      break;
    case "editQueueType":
      await updateQueueType(request, queue_id, formData);
      break;
  }

  return {};
}

function QueueTypeManagePage() {
  const { queuesType, shop_id } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div className="max-w-full mx-auto p-4 relative">
      {/* Add button */}
      <div className="flex flex-row justify-end my-4">
        <button
          className="bg-white rounded-full p-3 border border-black shadow-md hover:bg-black hover:text-white hover:border-white active:scale-90 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Create Queue Type
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  revalidator.revalidate();
                }}
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <fetcher.Form
              method="POST"
              encType="multipart/form-data"
              className="space-y-5"
              onSubmit={(e) => {
                const formData = new FormData(e.currentTarget);

                if (
                  !formData.get("image_url") ||
                  formData.get("image_url") === "undefined"
                ) {
                  formData.set("image_url", "");
                }

                setIsModalOpen(false);
              }}
            >
              <input
                type="number"
                name="shop_id"
                value={shop_id}
                className="hidden"
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors duration-200">
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                      } else {
                        setPreviewImage(null);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {!previewImage ? (
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Plus className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    ) : (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded border border-gray-200"
                      />
                    )}
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
                  placeholder="Enter queue type name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
                  placeholder="Describe this queue type"
                ></textarea>
              </div>

              {/* Tag */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tag
                </label>
                <input
                  type="text"
                  name="tag"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
                  placeholder="Add a tag (e.g., 'VIP', 'Standard')"
                />
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  name="is_available"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200 bg-white"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-200 font-medium text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  name="_action"
                  value="createQueueType"
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition duration-200 font-medium shadow-sm"
                >
                  Create
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      )}

      {/* Queue Type List */}
      {queuesType.length > 0 ? (
        <div className="flex flex-wrap gap-4 max-h-[78vh] overflow-y-auto">
          {queuesType.map((queueType, index) => (
            <QueueTypeCard key={index} queueType={queueType} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">ไม่มีประเภทของคิว</div>
      )}
    </div>
  );
}

export default QueueTypeManagePage;
