import {
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import ReservationCard from "~/components/reservation-card";
import {
  changeQueueStatus,
  fetchCustomerInQueue,
  fetchQueueDetail,
  nextQueue,
} from "~/repositories/queues-api";
import { getAuthCookie } from "~/services/cookie";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const data = await getAuthCookie({ request });
  if (!data) return redirect("/login");
  const queue_id = parseInt(params.queue_id as string);
  try {
    var inQueues = await fetchCustomerInQueue(request, queue_id);
    var queueDetail = await fetchQueueDetail(request, queue_id);
  } catch (e) {
    console.error(e);
    inQueues = { data: [] }; // Ensure we always return an array
    queueDetail = { data: null }; // Handle missing data
  }
  return { queueItems: inQueues.data, queueDetail: queueDetail.data };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const queue_id = parseInt(formData.get("queue_id") as string);
  if (!queue_id) return;
  switch (action) {
    case "nextQueue":
      await nextQueue(request, queue_id);
      break;
    case "changeStatus":
      console.log("changeStatus");
      const status = formData.get("status") === "true";
      await changeQueueStatus(request, queue_id, status);
      break;
    default:
      console.log("Default action");

      break;
  }
}

function QueueManagePage() {
  const { queueItems, queueDetail } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4 relative bg-gray-50 min-h-screen">
      {/* Sticky Header with Queue Details */}
      <div className="sticky top-0 bg-white shadow-lg p-4 rounded-lg flex items-center justify-between mb-6 z-10 border-b-2 border-blue-500">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex items-center"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          <span className="ml-1">Back</span>
        </button>

        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          คิวตอนนี้: {queueDetail?.tag + queueDetail?.queue_counter || "N/A"}
        </h1>

        <fetcher.Form method="PATCH">
          <input type="hidden" name="queue_id" value={queueDetail.id} />
          <input
            type="hidden"
            name="status"
            value={String(!queueDetail.is_available)}
          />
          <button
            type="submit"
            name="_action"
            value="changeStatus"
            className={`p-2 rounded-full  duration-300 flex items-center 
              active:scale-95 transition cursor-pointer
              ${
                queueDetail?.is_available
                  ? "bg-green-100 hover:bg-green-200 text-green-700"
                  : "bg-red-100 hover:bg-red-200 text-red-700"
              }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {queueDetail?.is_available ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              )}
            </svg>
            <span className="ml-1">
              {queueDetail?.is_available ? "Open" : "Closed"}
            </span>
          </button>
        </fetcher.Form>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg
              className="w-6 h-6 text-blue-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            Queue List
          </h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {queueItems.length} customers
          </span>
        </div>

        {queueItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queueItems.map((item: any, index: number) => (
              <div
                key={item.id}
                className="transform transition-all duration-300 hover:scale-105"
              >
                <ReservationCard
                  id={item.id}
                  name={item.user_name}
                  table={`${item.name}`}
                  status={item.is_available ? "Available" : "Unavailable"}
                  phone={item.user_phone}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-500 text-lg">No customers in queue</p>
            <p className="text-gray-400">Your queue is currently empty</p>
          </div>
        )}
      </div>

      {/* Bottom Right Buttons */}
      <div className="fixed bottom-4 right-4 flex gap-4">
        <fetcher.Form method="post">
          <input type="hidden" name="queue_id" value={queueDetail?.id} />
          <button
            type="submit"
            name="_action"
            value="nextQueue"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
            เรียกคิวนี้
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}

export default QueueManagePage;
