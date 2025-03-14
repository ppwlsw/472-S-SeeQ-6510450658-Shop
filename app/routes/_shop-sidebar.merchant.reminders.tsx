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
import ReminderCard from "~/components/reminder-card";
import { reminder_provider, shop_provider } from "~/provider/provider";
import {
  createShopReminder,
  fetchingShopReminders,
  type ReminderProp,
} from "~/repositories/reminder-api";
import { getAuthCookie } from "~/services/cookie";

export async function loader({ request }: LoaderFunctionArgs) {
  const data = await getAuthCookie({ request });
  if (!data) {
    return redirect("/login");
  }
  const user_id = data.user_id;
  const shop_id = shop_provider[user_id]?.id;
  if (!shop_id) {
    console.error("Shop ID is undefined");
    return { shop: null, reminders: [] };
  }

  await fetchingShopReminders(shop_id, request);

  return {
    shop: shop_provider[user_id] || null,
    reminders: reminder_provider[shop_id] || [],
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const data = await getAuthCookie({ request });

  if (!data) {
    return redirect("/login");
  }

  switch (action) {
    case "createReminder":
      const payload: ReminderProp = {
        shop_id: shop_provider[data.user_id]?.id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        due_date: formData.get("dateTime") as string,
      };

      createShopReminder(request, payload);
      break;
    case "markAsDone": 
      const reminder_id = formData.get("reminder_id") as string;
      break;
  }

  return {};
}

export default function RemindersPage() {
  const { reminders, shop } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetcher = useFetcher();
  const validator = useRevalidator();

  return (
    <div className="max-w-full mx-auto p-4 relative">
      {/* Add button */}
      <div className="flex flex-row justify-end my-4">
        <button
          className="bg-white rounded-full p-3
          border border-black shadow-md
          hover:bg-black hover:text-white hover:border-white active:scale-90 
          transition"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Reminder</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  validator.revalidate();
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <fetcher.Form
              method="POST"
              className="space-y-4"
              onSubmit={() => {
                setIsModalOpen(false);
              }}
            >
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium">Date & Time</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

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
                  value="createReminder"
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

      {/* Reminder List */}
      {reminders.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {reminders.map((reminder, index) => (
            <ReminderCard time={reminder.due_date} key={index} {...reminder} />
          ))}
        </div>
      ) : (
        <div className="flex w-full h-full">
          <h1>No Reminders</h1>
        </div>
      )}
    </div>
  );
}
