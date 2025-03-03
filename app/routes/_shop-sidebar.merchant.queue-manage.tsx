import QueueTypeCard from "~/components/queue-type-card";

function QueueTypeManagePage() {
  const queueItems = [
    {
      name: "Queue Type 1",
      description: "Queue Type 1 Description",
      queue_image_url: "/teenoi.png",
      current_queue: "A05",
      is_available: true,
      tag: "A",
      shop_id: 1,
    },
    {
      name: "Queue Type 2",
      description: "Queue Type 2 Description",
      queue_image_url: "/teenoi.png",
      current_queue: "A06",
      is_available: true,
      tag: "A",
      shop_id: 1,
    },
    {
      name: "Queue Type 3",
      description: "Queue Type 3 Description",
      queue_image_url: "/teenoi.png",
      current_queue: "A07",
      is_available: true,
      tag: "A",
      shop_id: 1,
    },
    {
      name: "Queue Type 4",
      description: "Queue Type 4 Description",
      queue_image_url: "/teenoi.png",
      current_queue: "A08",
      is_available: true,
      tag: "A",
      shop_id: 1,
    },
    {
      name: "Queue Type 5",
      description: "Queue Type 5 Description",
      queue_image_url: "/teenoi.png",
      current_queue: "A09",
      is_available: true,
      tag: "A",
      shop_id: 1,
    },
  ];


  return (
    <div className="flex flex-col">
      {queueItems.map((queueType, index) => (
        <QueueTypeCard key={index} queueType={queueType} />
      ))}
    </div>
  );
}

export default QueueTypeManagePage;
