import { useEffect, useState } from "react";
import QRCode from "qrcode";
import ReservationCard from "~/components/reservation-card";
import StatCard from "~/components/stat-card";
import ReminderCard from "~/components/reminder-card";
import { CalendarCheck, Clock, Users, XCircle, QrCode } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link, useLoaderData, useNavigate } from "react-router";
import { type LoaderFunctionArgs } from "react-router";
import { reminder_provider, shop_provider } from "~/provider/provider";
import { fetchingShopReminders } from "~/repositories/reminder-api";
import { useAuth } from "~/utils/auth";
import { fetchingShopData, fetchShopStat } from "~/repositories/shop-api";
import { generateQRCode } from "~/utils/generate-qr";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });
  const user_id = data.user_id;

  try {
    await fetchingShopData(user_id, request);
    const shop_id = shop_provider[user_id]?.id;

    if (!shop_id) {
      return {
        shop: null,
        reminders: [],
        stats: null,
        user_in_queues: [],
        shop_id: null,
      };
    }
    await fetchingShopReminders(shop_id, request);
    const stats = await fetchShopStat(shop_id, request);
    console.log("STATS", stats);
    if (stats != undefined) {
      if (stats.shop_stat.length == 0) {
        stats.shop_stat = [
          {
            total_queues: 0,
            waiting_count: 0,
            completed_count: 0,
            canceled_count: 0,
          },
        ];
      }
    }
    console.log("Stat after : ");

    return {
      shop: shop_provider[user_id] || null,
      reminders: reminder_provider[shop_id] || [],
      stats: stats.shop_stat || null,
      user_in_queues: stats?.users_in_queues || [],
      shop_id: shop_id,
    };
  } catch (e) {
    console.error("Error fetching shop reminders:", e);
  }

  return {};
}

// Mock Stacked Bar Chart Data
const mockChartData = [
  { name: "Mon", waiting: 20, completed: 25, canceled: 5, date: "2025-03-17" },
  { name: "Tue", waiting: 25, completed: 30, canceled: 5, date: "2025-03-18" },
  { name: "Wed", waiting: 30, completed: 35, canceled: 5, date: "2025-03-19" },
  { name: "Thu", waiting: 40, completed: 35, canceled: 5, date: "2025-03-20" },
  { name: "Fri", waiting: 50, completed: 35, canceled: 5, date: "2025-03-21" },
  { name: "Sat", waiting: 60, completed: 35, canceled: 5, date: "2025-03-22" },
  { name: "Sun", waiting: 70, completed: 35, canceled: 5, date: "2025-03-23" },
];

function DashboardPage() {
  const { reminders, stats, user_in_queues, shop_id } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [chartData, setChartData] = useState(mockChartData);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    setChartData(mockChartData);
  }, []);

  async function handleCreateQrCode() {
    if (!shop_id) {
      alert("Shop ID not available");
      return;
    }
    try {
      const jsonData = JSON.stringify({
        action: "s",
        shop_id: shop_id,
      });

      const { qrCodeDataUrl, data } = await generateQRCode(jsonData);

      setQrCodeUrl(qrCodeDataUrl);
      setQrCodeData(data);
    } catch (err) {
      console.error("Error generating QR code:", err);
      alert("Failed to generate QR code");
    }
  }

  const statCards = [
    {
      title: "Total Queues",
      value: stats != undefined ? stats[0]?.total_queues : 0,
      icon: <Users size={24} className="text-indigo-600" />,
    },
    {
      title: "Waiting",
      value: stats != undefined ? stats[0]?.waiting_count : 0,
      icon: <Clock size={24} className="text-amber-600" />,
    },
    {
      title: "Completed",
      value: stats != undefined ? stats[0]?.completed_count : 0,
      icon: <CalendarCheck size={24} className="text-green-600" />,
    },
    {
      title: "Canceled",
      value: stats != undefined ? stats[0]?.canceled_count : 0,
      icon: <XCircle size={24} className="text-red-600" />,
    },
  ];

  const handleViewAllQueueButton = () => {
    navigate("/merchant/queue-manage");
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with QR Code Generation */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleCreateQrCode}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <QrCode size={20} />
          Generate Shop QR Code
        </button>
      </div>

      {/* QR Code Modal */}
      {qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Your Shop QR Code</h2>
            <img
              src={qrCodeUrl}
              alt="Shop QR Code"
              className="mx-auto mb-4 border-4 border-blue-500 rounded-lg"
            />
            {/* QR Code Data */}
            {/* // ! Delete this section later */}
            <section>
              <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">QR Code Data</h3>
                <pre className="text-sm text-left bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(qrCodeData || "{}"), null, 2)}
                </pre>
              </div>
            </section>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.download = "shop_qr_code.png";
                  link.href = qrCodeUrl;
                  link.click();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => {
                  setQrCodeUrl(null);
                  setQrCodeData(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Queues Section */}
        <div className="bg-white rounded-xl min-w-[30vh] shadow-lg overflow-hidden border-t-4 border-indigo-500 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800">All Queues</h2>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
              onClick={handleViewAllQueueButton}
            >
              View All
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            {user_in_queues && user_in_queues.length > 0 ? (
              user_in_queues.map((res: any) => (
                <ReservationCard
                  key={res.queue_number}
                  id={res.queue_number}
                  name={res.customer_name}
                  table={res.queue_number}
                  status={res.status}
                  phone={res.phone_number || ""}
                />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No active queues at the moment
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 space-y-6 flex-1">
          {/* Reminders Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500 transform transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800">
                Reminders
              </h2>
              <Link
                to={"/merchant/reminders"}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="flex flex-wrap gap-4">
                {reminders && reminders.length > 0 ? (
                  reminders.map((reminder: any, index: number) => (
                    <ReminderCard
                      key={index}
                      id={reminder.id}
                      title={reminder.title}
                      time={new Date(reminder.due_date)}
                      description={reminder.description}
                    />
                  ))
                ) : (
                  <div className="text-center w-full py-6 text-gray-500">
                    <h1>No reminders</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
