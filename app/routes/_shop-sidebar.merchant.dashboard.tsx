import ReservationCard from "~/components/reservation-card";
import StatCard from "~/components/stat-card";
import ReminderCard from "~/components/reminder-card";
import { CalendarCheck, Clock, Users, XCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link, useLoaderData, useNavigate } from "react-router";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { reminder_provider, shop_provider } from "~/provider/provider";
import { fetchingShopReminders } from "~/repositories/reminder-api";
import { fetchingQueuesType } from "~/repositories/queues-api";
import { useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const data = await getCookie({ request });


  const user_id = data.user_id;
  const shop_id = shop_provider[user_id]?.id;

  if (!shop_id) {
    console.error("Shop ID is undefined");
    return { shop: null, reminders: [] };
  }

  try {
    await fetchingShopReminders(shop_id, request);
    await fetchingQueuesType(request, shop_id);
  } catch (e) {
    console.error("Error fetching shop reminders:", e);
  }

  return {
    shop: shop_provider[user_id] || null,
    reminders: reminder_provider[shop_id] || [], // Ensure it's an array
  };
}

function DashboardPage() {
  // Mock Data for Stats
  const stats = [
    { title: "Total Reservations", value: 120, icon: <CalendarCheck /> },
    { title: "Pending Reservations", value: 30, icon: <Clock /> },
    { title: "Seated Customers", value: 85, icon: <Users /> },
    { title: "Cancelled", value: 5, icon: <XCircle /> },
  ];

  // Mock Data for Reservations
  const reservations = [
    {
      id: 1,
      name: "John Doe",
      time: "6:30 PM",
      date: "Feb 28, 2025",
      table: "T-5",
      capacity: "4",
      status: "waiting",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      time: "7:00 PM",
      date: "Feb 28, 2025",
      table: "T-12",
      capacity: "2",
      status: "completed",
      phone: "987-654-3210",
    },
    {
      id: 3,
      name: "Alice Johnson",
      time: "7:30 PM",
      date: "Feb 28, 2025",
      table: "T-8",
      capacity: "6",
      status: "completed",
      phone: "555-678-1234",
    },
    {
      id: 4,
      name: "Bob Williams",
      time: "8:00 PM",
      date: "Feb 28, 2025",
      table: "T-3",
      capacity: "3",
      status: "canceled",
      phone: "111-222-3333",
    },
  ];

  // Mock Data for Chart
  const data = [
    { name: "Sun", count: 10 },
    { name: "Mon", count: 2 },
    { name: "Tue", count: 13 },
    { name: "Wed", count: 5 },
    { name: "Thu", count: 2 },
    { name: "Fri", count: 16 },
    { name: "Sat", count: 23 },
  ];

  const navigate = useNavigate();

  const handleViewAllQueueButton = () => {
    navigate("/merchant/queue-manage");
  };

  const { shop, reminders } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 min-h-screen">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
            {reservations.map((res) => (
              <ReservationCard key={res.id} {...res} />
            ))}
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
                {reminders.length != 0 ? (
                  reminders.map((reminder: any, index: number) => {
                    return (
                      <ReminderCard
                        key={index}
                        id={reminder.id}
                        title={reminder.title}
                        time={new Date(reminder.due_date)}
                        description={reminder.description}
                      />
                    );
                  })
                ) : (
                  <div>
                    <h1>ไม่มีการแจ้งเตือน</h1>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-[45vh]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Queue Chart
            </h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  activeBar={<Rectangle fill="#4f46e5" stroke="none" />}
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
