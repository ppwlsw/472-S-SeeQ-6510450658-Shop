import { useEffect, useState } from "react";
import ReservationCard from "~/components/reservation-card";
import StatCard from "~/components/stat-card";
import ReminderCard from "~/components/reminder-card";
import { CalendarCheck, Clock, Users, XCircle } from "lucide-react";
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
import { fetchShopStat } from "~/repositories/shop-api";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });

  const user_id = data.user_id;
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

  try {
    await fetchingShopReminders(shop_id, request);
    const stats = await fetchShopStat(shop_id, request);

    return {
      shop: shop_provider[user_id] || null,
      reminders: reminder_provider[shop_id] || [],
      stats: stats?.shop_stat || null,
      user_in_queues: stats?.users_in_queues || [],
      shop_id: shop_id,
    };
  } catch (e) {
    console.error("Error fetching shop reminders:", e);
  }

  return {
    shop: shop_provider[user_id] || null,
    reminders: reminder_provider[shop_id] || [],
    stats: [
      {
        total_queues: 0,
        waiting_count: 0,
        completed_count: 0,
        canceled_count: 0,
      },
    ],
    user_in_queues: [],
    shop_id: shop_id,
  };
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
  const { reminders, stats, user_in_queues } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [chartData, setChartData] = useState(mockChartData);

  useEffect(() => {
    setChartData(mockChartData);
  }, []);

  const statCards = [
    {
      title: "Total Queues",
      value: stats[0]?.total_queues || 0,
      icon: <Users size={24} className="text-indigo-600" />,
    },
    {
      title: "Waiting",
      value: stats[0]?.waiting_count || 0,
      icon: <Clock size={24} className="text-amber-600" />,
    },
    {
      title: "Completed",
      value: stats[0]?.completed_count || 0,
      icon: <CalendarCheck size={24} className="text-green-600" />,
    },
    {
      title: "Canceled",
      value: stats[0]?.canceled_count || 0,
      icon: <XCircle size={24} className="text-red-600" />,
    },
  ];

  const handleViewAllQueueButton = () => {
    navigate("/merchant/queue-manage");
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 min-h-screen">
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
        <div className="bg-white rounded-xl min-w-[30vh] shadow-lg overflow-hidden">
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                    <h1>ไม่มีการแจ้งเตือน</h1>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-[45vh]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Weekly Queue Statistics
            </h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar
                  name="Waiting"
                  dataKey="waiting"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Completed"
                  dataKey="completed"
                  stackId="a"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Canceled"
                  dataKey="canceled"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
