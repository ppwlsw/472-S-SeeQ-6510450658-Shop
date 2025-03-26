interface QueueData {
    total_queues: number;
    waiting_count: number;
    completed_count: number;
    canceled_count: number;
    timestamp?: Date; // Optional timestamp to track when the data was recorded
  }
  
  interface QueueGraphProps {
    name: string;
    total_queues: number;
    waiting_count: number;
    completed_count: number;
    canceled_count: number;
  }
  
  function calculateQueueInSevenDays(queues: QueueData[]): QueueGraphProps[] {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  
    // Filter and sort queues within the current week
    const currentWeekQueues = queues
      .filter(queue => {
        const queueDate = queue.timestamp || new Date();
        return queueDate >= currentWeekStart;
      })
      .sort((a, b) => (a.timestamp || new Date()).getTime() - (b.timestamp || new Date()).getTime());
  
    let data: QueueGraphProps[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + (6 - i));
  
      // Create a copy before reversing
      const queueForDate = [...currentWeekQueues].reverse().find(queue => {
        const queueDate = queue.timestamp || new Date();
        return (
          queueDate.getDate() === date.getDate() &&
          queueDate.getMonth() === date.getMonth() &&
          queueDate.getFullYear() === date.getFullYear()
        );
      });
  
      // If no data for the day, use a zero-filled object
      const processedQueueData = queueForDate || {
        total_queues: 0,
        waiting_count: 0,
        completed_count: 0,
        canceled_count: 0,
      };
  
      data.push({
        name: dayNames[date.getDay()].slice(0, 3),
        total_queues: processedQueueData.total_queues,
        waiting_count: processedQueueData.waiting_count,
        completed_count: processedQueueData.completed_count,
        canceled_count: processedQueueData.canceled_count,
      });
    }
  
    return data;
  }
  
  
  export { calculateQueueInSevenDays };