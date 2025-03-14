import { useEffect } from "react";
import ReservationCard from "~/components/reservation-card";

function QueueManagePage() {
  const queueItems = [
    {
      id: 1,
      name: "Preshit Pimple",
      time: "10:30AM",
      date: "Today",
      table: "Table A",
      capacity: "6-8 Persons",
      status: "Completed",
      phone: "088-888-8888",
    },
    {
      id: 2,
      name: "Jane Smith",
      time: "11:45AM",
      date: "Today",
      table: "Table B",
      capacity: "4-6 Persons",
      status: "Waiting",
      phone: "099-999-9999",
    },
    {
      id: 3,
      name: "Bob Johnson",
      time: "01:00PM",
      date: "Today",
      table: "Table C",
      capacity: "2-4 Persons",
      status: "Seated",
      phone: "077-777-7777",
    },
  ];

  const handleBack = () => {
    console.log("Back button clicked");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6 justify-between">
        <button
          onClick={handleBack}
          className="mr-4 p-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">คิวตอนนี้ : A05 </h1>
        <button
          onClick={handleBack}
          className="mr-4 p-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      {/* All Queue using ReservationCard */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Queue List</h2>
        {queueItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queueItems.map((item) => (
              <ReservationCard
                key={item.id}
                id={item.id}
                name={item.name}
                time={item.time}
                date={item.date}
                table={item.table}
                capacity={item.capacity}
                status={item.status}
                phone={item.phone}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No customers in queue</p>
        )}
      </div>
    </div>
  );
}

export default QueueManagePage;
