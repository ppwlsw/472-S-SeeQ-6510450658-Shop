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
import {
  queue_provider,
  setQueueProvider,
  shop_provider,
} from "~/provider/provider";
import { createQueueType, fetchingQueuesType } from "~/repositories/queues-api";
import { useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });

  const user_id = data.user_id;
  const shop_id = shop_provider[user_id]?.id;
  try {
    const queueTypes = await fetchingQueuesType(request, shop_id);
    // setQueueProvider(shop_id, queueTypes.queueTypes);
  } catch (e) {
    console.error(e);
  }
  return { queuesType: queue_provider[shop_id] || [], shop_id: shop_id };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const { getCookie } = useAuth;
  const data = await getCookie({ request });

  if (!data) return redirect("/login");

  switch (action) {
    case "createQueueType":
      await createQueueType(request, formData);
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Queue Type</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  revalidator.revalidate();
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <fetcher.Form
              method="POST"
              encType="multipart/form-data"
              className="space-y-4"
              onSubmit={() => setIsModalOpen(false)}
            >
              <input
                type="number"
                name="shop_id"
                value={shop_id}
                className="hidden"
              />
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {/* Image Preview */}
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-medium">Tag</label>
                <input
                  type="text"
                  name="tag"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium">
                  Availability
                </label>
                <select
                  name="is_available"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  name="_action"
                  value="createQueueType"
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
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
        <div className="text-center text-gray-500 mt-8">
          No queue types available
        </div>
      )}
    </div>
  );
}

export default QueueTypeManagePage;
