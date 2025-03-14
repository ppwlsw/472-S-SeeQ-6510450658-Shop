import { useFetcher } from "react-router";

interface ReminderCardProps {
  id: number;
  title: string;
  time: Date;
  description: string;
}

function ReminderCard({ id, title, time, description }: ReminderCardProps) {
  const fetcher = useFetcher();
  const formattedTime = new Date(time).toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col bg-white rounded-md shadow-md p-4 w-64">
      <div className="text-lg font-bold line-clamp-1">{title}</div>
      <div className="text-md font-light text-slate-500">
        ⏰ เวลา: {formattedTime}
      </div>
      <div className="text-sm text-gray-700 line-clamp-2 mt-2">
        {description}
      </div>
      <fetcher.Form method="POST" className="mt-4">
        <input type="hidden" name="reminder_id" value={id} />
        <button
          type="submit"
          name="_action"
          value="markAsDone"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        >
          Mark as Done
        </button>
      </fetcher.Form>
    </div>
  );
}

export default ReminderCard;
