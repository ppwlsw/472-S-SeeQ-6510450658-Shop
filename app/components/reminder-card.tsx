interface ReminderCardProps {
  title: string;
  time: string;
  description: string;
}

function ReminderCard({ title, time, description }: ReminderCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-md shadow-md p-4 w-64">
      <div className="text-lg font-bold line-clamp-2">{title}</div>
      <div className="text-md font-light text-slate-500">⏰ เวลา: {time}</div>
      <div className="text-sm text-gray-700 line-clamp-4 mt-2">
        {description}
      </div>
    </div>
  );
}

export default ReminderCard;
