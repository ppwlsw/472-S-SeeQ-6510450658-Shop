import {
  UtensilsCrossed,
  Phone,
  Clock,
  User,
  CalendarClock,
} from "lucide-react";

interface ReservationCardProps {
  id: number;
  name: string;
  table: string;
  status: string;
  phone: string;
}

function ReservationCard({ name, table, status, phone }: ReservationCardProps) {
  // Status styling logic with enhanced colors and capitalization
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          icon: <CalendarClock size={14} className="mr-1" />,
        };
      case "waiting":
        return {
          bg: "bg-amber-100",
          text: "text-amber-600",
          icon: <Clock size={14} className="mr-1" />,
        };
      case "canceled":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          icon: <Clock size={14} className="mr-1 opacity-70" />,
        };
      default:
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          icon: <CalendarClock size={14} className="mr-1" />,
        };
    }
  };

  // Phone number formatting
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "";
    // Basic formatting for Thai phone numbers: 0xx-xxx-xxxx
    if (phoneNumber.length === 10) {
      return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(
        3,
        6
      )}-${phoneNumber.substring(6)}`;
    }
    return phoneNumber;
  };

  // Get status styling
  const statusStyle = getStatusStyles(status);

  // Capitalize status
  const capitalizedStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <div
      className="flex flex-col w-full max-w-xs h-auto rounded-xl border-gray-200 border p-5 justify-between bg-white
      shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-blue-50 opacity-40 z-0 group-hover:opacity-60 transition-opacity duration-500"></div>
      <div className="absolute -bottom-14 -left-14 w-28 h-28 rounded-full bg-blue-50 opacity-0 z-0 group-hover:opacity-30 transition-all duration-500"></div>

      <section
        id="upper-section"
        className="border-b border-gray-200 flex flex-col pb-4 z-10"
      >
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="font-bold flex items-center text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg">
            <UtensilsCrossed size={16} className="mr-2 text-gray-600" />
            {table}
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.icon}
            {capitalizedStatus}
          </div>
        </div>

        <div className="flex flex-col my-3">
          <div className="flex items-center mb-2">
            <User size={16} className="mr-2 text-gray-500" />
            <div className="text-lg font-bold truncate text-gray-800">
              {name}
            </div>
          </div>

          <div className={`flex items-center text-sm ${statusStyle.text}`}>
            <Clock size={14} className="mr-2" />
            <span>
              {status.toLowerCase() === "waiting"
                ? "รออยู่ในคิว"
                : status.toLowerCase() === "completed"
                ? "เสร็จสิ้นแล้ว"
                : "ยกเลิกแล้ว"}
            </span>
          </div>
        </div>
      </section>

      {/* Lower Section */}
      <section id="lower-section" className="pt-4 z-10">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 mb-1">เบอร์โทรศัพท์</p>
            <p className="font-medium text-gray-800">
              {formatPhoneNumber(phone)}
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = `tel:${phone}`;
            }}
            className="bg-blue-600 p-2.5 rounded-full hover:bg-blue-700 transition-all duration-300 
                      transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
            aria-label="Call customer"
          >
            <Phone size={18} className="text-white" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default ReservationCard;
