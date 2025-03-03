import { useNavigate } from "react-router";

export interface QueueTypeCardProps {
  name: string;
  description: string;
  queue_image_url: string;
  current_queue: string;
  is_available: boolean;
  tag: string;
  shop_id: number;
}

export default function QueueTypeCard({
  queueType,
}: {
  queueType: QueueTypeCardProps;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Queue Type Clicked");
    navigate(`/merchant/queue/`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-row bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-md hover:shadow-lg cursor-pointer transition duration-150 ease-in-out"
    >
      {/* Image Section */}
      <div className="w-16 h-16 flex items-center justify-center">
        <img
          src={queueType.queue_image_url}
          alt={queueType.name}
          className="w-full h-full object-cover rounded-full border border-gray-300"
        />
      </div>

      {/* Details Section */}
      <div className="flex flex-col w-2/3 pl-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {queueType.name}
        </h2>
        <p className="text-sm text-gray-500 mb-2">{queueType.description}</p>
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
    </div>
  );
}
