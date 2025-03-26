import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import {
  CalendarCheck,
  Clock,
  Users,
  XCircle,
  QrCode as QrCodeIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import ReservationCard from "~/components/reservation-card";
import ReminderCard from "~/components/reminder-card";
import { reminder_provider, shop_provider } from "~/provider/provider";
import { fetchingShopReminders } from "~/repositories/reminder-api";
import { useAuth } from "~/utils/auth";
import { fetchingShopData, fetchShopStat } from "~/repositories/shop-api";
import { generateQRCode } from "~/utils/generate-qr";
import { calculateQueueInSevenDays } from "~/utils/stat-calculate";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

function DashboardPage() {
  const { reminders, stats, user_in_queues, shop_id } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

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
      icon: <Users className="text-indigo-600" />,
    },
    {
      title: "Waiting",
      value: stats != undefined ? stats[0]?.waiting_count : 0,
      icon: <Clock className="text-amber-600" />,
    },
    {
      title: "Completed",
      value: stats != undefined ? stats[0]?.completed_count : 0,
      icon: <CalendarCheck className="text-green-600" />,
    },
    {
      title: "Canceled",
      value: stats != undefined ? stats[0]?.canceled_count : 0,
      icon: <XCircle className="text-red-600" />,
    },
  ];

  const handleViewAllQueueButton = () => {
    navigate("/merchant/queue-manage");
  };

  const handleDownloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = "shop_qr_code.png";
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const chartData = calculateQueueInSevenDays(stats);

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Header with QR Code Generation */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button onClick={handleCreateQrCode}>
          <QrCodeIcon className="mr-2 h-4 w-4" />
          Generate Shop QR Code
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-sm text-muted-foreground">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              {stat.icon}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Queue Status Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ภาพรวมร้านค้าใน 7 วันล่าสุด
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="waiting_count" stackId="a" fill="#fbbf24" />
            <Bar dataKey="completed_count" stackId="a" fill="#34d399" />
            <Bar dataKey="canceled_count" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queues Section - Now in left column */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row w-full items-center justify-between space-y-0 p-6 border-b">
            <CardTitle className="text-2xl">คิวทั้งหมด</CardTitle>
            <Button variant="link" onClick={handleViewAllQueueButton}>
              ดูทั้งหมด
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[50vh] ">
              {user_in_queues && user_in_queues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user_in_queues.map((res: any) => (
                    <ReservationCard
                      key={res.queue_number}
                      id={res.queue_number}
                      name={res.customer_name}
                      table={res.queue_number}
                      status={res.status}
                      phone={res.phone_number || ""}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  ยังไม่มีลูกค้าในคิว 😢
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Reminders Section - Now in right column */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b">
            <CardTitle className="text-2xl">การแจ้งเตือน</CardTitle>
            <Button variant="link" asChild>
              <Link to="/merchant/reminders">ดูทั้งหมด</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[50vh]">
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
                  <div className="text-center w-full py-6 text-muted-foreground">
                    ไม่มีการแจ้งเตือนใหม่
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={!!qrCodeUrl} onOpenChange={() => setQrCodeUrl(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Shop QR Code</DialogTitle>
          </DialogHeader>

          {qrCodeUrl && (
            <>
              <div className="flex justify-center">
                <img
                  src={qrCodeUrl}
                  alt="Shop QR Code"
                  className="mx-auto mb-4 border-4 border-blue-500 rounded-lg max-w-full"
                />
              </div>

              {/* QR Code Data (for debugging) */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>QR Code Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm text-left bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(JSON.parse(qrCodeData || "{}"), null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <DialogFooter className="sm:justify-start">
                <Button variant="outline" onClick={handleDownloadQRCode}>
                  Download
                </Button>
                <Button variant="secondary" onClick={() => setQrCodeUrl(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DashboardPage;
