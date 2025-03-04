import ReservationCard from "~/components/reservation-card";
import StatCard from "~/components/stat-card";
import ReminderCard from "~/components/reminder-card";
import { CalendarCheck, Clock, Users, XCircle } from "lucide-react";
import { useNavigate } from "react-router";

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
      status: "Pending",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      time: "7:00 PM",
      date: "Feb 28, 2025",
      table: "T-12",
      capacity: "2",
      status: "Completed",
      phone: "987-654-3210",
    },
    {
      id: 3,
      name: "Alice Johnson",
      time: "7:30 PM",
      date: "Feb 28, 2025",
      table: "T-8",
      capacity: "6",
      status: "Completed",
      phone: "555-678-1234",
    },
    {
      id: 4,
      name: "Bob Williams",
      time: "8:00 PM",
      date: "Feb 28, 2025",
      table: "T-3",
      capacity: "3",
      status: "Canceled",
      phone: "111-222-3333",
    },
  ];

  // Mock Data for Reminders
  const reminders = [
    {
      title: "Confirm customer arrival",
      time: "10:30 AM",
      description: "Call Mr. John Doe to confirm his reservation at Table 5.",
    },
    {
      title: "Prepare VIP table",
      time: "12:00 PM",
      description: "Ensure Table 1 is set with premium utensils and wine.",
    },
    {
      title: "Staff Meeting",
      time: "4:00 PM",
      description: "Discuss new customer service guidelines for the weekend.",
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
              <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <div className="flex gap-4">
                {reminders.map((reminder, index) => (
                  <ReminderCard
                    key={index}
                    title={reminder.title}
                    time={reminder.time}
                    description={reminder.description}
                  />
                ))}
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
