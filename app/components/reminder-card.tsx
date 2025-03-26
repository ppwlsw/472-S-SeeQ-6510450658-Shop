import { useFetcher } from "react-router";
import { Check, Bell, Clock } from "lucide-react";
import Swal from "sweetalert2";

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

  // Calculate if the reminder is upcoming, today, or past
  const now = new Date();
  const reminderDate = new Date(time);
  const isToday = reminderDate.toDateString() === now.toDateString();
  const isPast = reminderDate < now;

  const handleMarkAsDone = (event: any) => {
    event.preventDefault();

    Swal.fire({
      title: "ยืนยันการทำเสร็จ?",
      text: `คุณต้องการทำเครื่องหมายว่า "${title}" เสร็จสิ้นแล้วใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4ade80",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "ใช่, เสร็จสิ้นแล้ว!",
      cancelButtonText: "ยกเลิก",
      customClass: {
        confirmButton: "order-2",
        cancelButton: "order-1",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Submit the form programmatically
        const formData = new FormData();
        formData.append("reminder_id", id.toString());
        formData.append("_action", "markAsDone");

        fetcher.submit(formData, { method: "POST" });

        // Show success message
        Swal.fire({
          title: "เสร็จสิ้น!",
          text: "การแจ้งเตือนถูกทำเครื่องหมายว่าเสร็จสิ้นแล้ว",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div
      className="flex flex-col bg-white rounded-lg p-5 w-64
        hover:scale-105 transition-transform duration-300 ease-in-out 
        shadow-lg border-l-4 border-blue-500 relative overflow-hidden"
    >
      {/* Decorative corner element */}
      <div className="absolute -top-4 -right-4 bg-blue-100 w-16 h-16 rounded-full opacity-40"></div>

      {/* Bell icon and status indicator */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-blue-500" />
          <div className="text-lg font-bold line-clamp-1">{title}</div>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            isPast ? "bg-gray-400" : isToday ? "bg-yellow-400" : "bg-green-400"
          }`}
        ></div>
      </div>

      {/* Time display with icon */}
      <div className="flex items-center text-md font-light text-slate-500 mt-1">
        <Clock size={16} className="mr-2" />
        <span>{formattedTime}</span>
      </div>

      {/* Description with subtle styling */}
      <div className="text-sm text-gray-700 line-clamp-2 mt-3 mb-2 bg-gray-50 p-2 rounded">
        {description}
      </div>

      {/* Action button - Using onClick handler instead of direct form submission */}
      <button
        onClick={handleMarkAsDone}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full
                  flex items-center justify-center gap-2 transform transition-all duration-200 
                  hover:shadow-md active:scale-95 mt-auto"
      >
        <Check size={18} />
        <span>เสร็จสิ้น</span>
      </button>
    </div>
  );
}

export default ReminderCard;
