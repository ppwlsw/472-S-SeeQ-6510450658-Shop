import { useNavigate } from "react-router";
import type { QueueType } from "~/repositories/queues-api";
import { Utensils, Calendar, Users, Tag } from "lucide-react";

export default function QueueTypeCard({ queueType }: { queueType: QueueType }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/merchant/queue/${queueType.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg cursor-pointer transition duration-150 ease-in-out w-80"
    >
      {/* Image Section */}
      <div className="w-full flex justify-center mb-4">
        {queueType.queue_image_url ? (
          <img
            src={queueType.queue_image_url}
            alt={queueType.name}
            className="w-20 h-20 object-cover rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full border border-gray-300">
            <Utensils className="w-10 h-10 text-gray-500" />
          </div>
        )}
      </div>

      {/* Queue Info */}
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {queueType.name}
      </h2>
      <p className="text-sm text-gray-500 text-center">
        {queueType.description}
      </p>

      {/* Status Badge */}
      <div className="flex justify-center mt-3">
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

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1 text-gray-500" />
          <span>{queueType.queue_counter} in queue</span>
        </div>

        <div className="flex items-center">
          <Tag className="w-4 h-4 mr-1 text-gray-500" />
          <span>Tag: {queueType.tag}</span>
        </div>
      </div>
    </div>
  );
}
