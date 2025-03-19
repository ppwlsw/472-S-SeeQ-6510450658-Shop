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
import { getAuthCookie } from "~/utils/cookie";
import Swal from "sweetalert2";
import { useEffect } from "react";

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

  let result = { success: false, message: "" };

  switch (action) {
    case "nextQueue":
      try {
        await nextQueue(request, queue_id);
        result = {
          success: true,
          message: "เรียกคิวถัดไปสำเร็จ",
        };
      } catch (e) {
        result = {
          success: false,
          message: "ไม่สามารถเรียกคิวถัดไปได้",
        };
      }
      break;
    case "changeStatus":
      try {
        const status = formData.get("status") === "true";
        await changeQueueStatus(request, queue_id, status);
        result = {
          success: true,
          message: status ? "เปิดคิวสำเร็จ" : "ปิดคิวสำเร็จ",
        };
      } catch (e) {
        result = {
          success: false,
          message: "ไม่สามารถเปลี่ยนสถานะคิวได้",
        };
      }
      break;
    default:
      break;
  }

  return result;
}

function QueueManagePage() {
  const { queueItems, queueDetail } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // Monitor fetcher data for showing SweetAlert notifications
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      const { success, message } = fetcher.data;

      if (success) {
        Swal.fire({
          title: "สำเร็จ!",
          text: message,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      } else if (message) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: message,
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      }
    }
  }, [fetcher.data, fetcher.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNextQueue = (e: any) => {
    e.preventDefault();

    Swal.fire({
      title: "เรียกคิวถัดไป?",
      text: "คุณต้องการเรียกคิวถัดไปใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, เรียกคิวถัดไป!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("queue_id", queueDetail?.id);
        formData.append("_action", "nextQueue");
        fetcher.submit(formData, { method: "post" });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 relative bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full -mr-32 -mt-32 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full -ml-32 -mb-32 opacity-20"></div>

      {/* Sticky Header with Queue Details */}
      <div className="sticky top-0 bg-white shadow-lg p-4 rounded-lg flex items-center justify-between mb-6 z-10 border-b-2 border-blue-500 backdrop-blur-md bg-opacity-90">
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

        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            คิวตอนนี้: {queueDetail?.tag + queueDetail?.queue_counter || "N/A"}
          </h1>
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString("th-TH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <fetcher.Form method="PATCH">
          <input type="hidden" name="queue_id" value={queueDetail?.id} />
          <input
            type="hidden"
            name="status"
            value={String(!queueDetail?.is_available)}
          />
          <button
            type="submit"
            name="_action"
            value="changeStatus"
            className={`p-2 rounded-full duration-300 flex items-center 
              active:scale-95 transition cursor-pointer shadow-sm
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-500 mb-1">รอคิว</h3>
          <p className="text-2xl font-bold">{queueItems.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500 mb-1">เรียกคิวแล้ว</h3>
          <p className="text-2xl font-bold">
            {queueDetail?.queue_counter || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500 mb-1">สถานะ</h3>
          <p className="text-xl font-bold">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                queueDetail?.is_available ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {queueDetail?.is_available ? "เปิดให้บริการ" : "ปิดให้บริการ"}
          </p>
        </div>
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
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <div className="animate-pulse mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
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
            </div>
            <h3 className="mt-2 text-gray-500 text-xl font-medium">
              No customers in queue
            </h3>
            <p className="text-gray-400 mt-1">Your queue is currently empty</p>
            <p className="text-blue-500 text-sm mt-4">
              {queueDetail?.is_available
                ? "Queue is open and waiting for customers"
                : "Queue is currently closed"}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Right Buttons */}
      <div className="fixed bottom-4 right-4 flex gap-4">
        <button
          onClick={handleNextQueue}
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 
                    shadow-lg flex items-center transform hover:scale-105 active:scale-95"
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
      </div>
    </div>
  );
}

export default QueueManagePage;
