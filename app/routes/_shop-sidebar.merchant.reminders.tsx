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
  markReminderAsDone,
  type ReminderProp,
} from "~/repositories/reminder-api";
import { useAuth } from "~/utils/auth";

// Shadcn UI Imports
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });
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
  const { getCookie } = useAuth;
  const data = await getCookie({ request });

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
      await markReminderAsDone(request, parseInt(reminder_id));
      break;
  }

  return {};
}

export default function RemindersPage() {
  const { reminders, shop } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const validator = useRevalidator();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-full mx-auto p-4 relative">
      {/* Add button */}
      <div className="flex flex-row justify-end my-4">
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Reminder</DialogTitle>
            </DialogHeader>

            <fetcher.Form
              method="POST"
              className="space-y-4"
              onSubmit={() => validator.revalidate()}
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTime">Date & Time</Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  name="dateTime"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  name="_action"
                  value="createReminder"
                  onClick={() => setIsOpen(false)}
                >
                  Create
                </Button>
              </div>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminder List */}
      {reminders.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {reminders.map((reminder, index) => (
            <ReminderCard time={reminder.due_date} key={index} {...reminder} />
          ))}
        </div>
      ) : (
        <div className="flex w-full h-full justify-center items-center text-gray-400">
          <h1>ไม่มีการแจ้งเตือน</h1>
        </div>
      )}
    </div>
  );
}
