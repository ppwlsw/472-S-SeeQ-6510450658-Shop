import { MapPin, Phone, Clock, User } from "lucide-react";

interface ReservationCardProps {
  id: number;
  name: string;
  table: string;
  status: string;
  phone: string;
}

function ReservationCard({ name, table, status, phone }: ReservationCardProps) {
  // Status styling logic
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-[#DAFFD9] text-[#33D117]";
      case "Pending":
        return "bg-[#FFE9D9] text-[#FF8A00]";
      case "Canceled":
        return "bg-[#FFD9D9] text-[#D11717]";
      case "Available":
        return "bg-[#D9F0FF] text-[#1767D1]";
      case "Unavailable":
        return "bg-[#F0D9FF] text-[#9517D1]";
      default:
        return "bg-[#DAFFD9] text-[#33D117]";
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

  return (
    <div
      className="flex flex-col w-full max-w-xs h-auto rounded-lg border-gray-200 border-[1px] p-4 justify-between bg-white
      shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
    >
      {/* Background decorative element */}
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gray-50 opacity-50 z-0"></div>

      <section
        id="upper-section"
        className="border-b-[1px] border-gray-200 flex flex-col pb-3 z-10"
      >
        <div className="flex flex-row justify-between items-center">
          <div className="font-bold flex items-center">
            <MapPin size={16} className="mr-1 text-gray-500" />
            {table}
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyles(
              status
            )}`}
          >
            {status}
          </div>
        </div>

        <div className="flex flex-col my-4">
          <div className="flex items-center mb-1">
            <User size={16} className="mr-2 text-gray-500" />
            <div className="text-lg font-bold truncate">{name}</div>
          </div>

          <div className="flex items-center text-[#718EBF] text-sm">
            <Clock size={14} className="mr-2" />
            <span>รออยู่ในคิว</span>
          </div>
        </div>
      </section>

      {/* Lower Section */}
      <section id="lower-section" className="pt-3 z-10">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <p className="text-xs text-gray-500">เบอร์โทรศัพท์</p>
            <p className="font-medium">{formatPhoneNumber(phone)}</p>
          </div>

          <button
            onClick={() => {
              window.location.href = `tel:${phone}`;
            }}
            className="bg-[#2D60FF] p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 active:scale-95"
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
