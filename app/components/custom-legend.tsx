const CustomLegend = ({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>;
}) => {
  // Define color mappings and descriptions in Thai
  const legendInfo = {
    waiting_count: {
      label: "กำลังรอ",
      description: "ออเดอร์ที่อยู่ในคิว",
      color: "#fbbf24",
    },
    completed_count: {
      label: "สำเร็จ",
      description: "ออเดอร์ที่ดำเนินการเสร็จสิ้น",
      color: "#34d399",
    },
    canceled_count: {
      label: "ยกเลิก",
      description: "ออเดอร์ที่ถูกยกเลิก",
      color: "#ef4444",
    },
  };

  return (
    <div className="flex flex-row w-full justify-around items-center space-x-4 p-2 bg-gray-50 rounded-lg">
      {payload?.map((entry, index) => {
        const info = legendInfo[entry.value as keyof typeof legendInfo];
        return (
          <div
            key={`legend-${index}`}
            className="flex justify-center items-center w-full space-x-2"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: info.color }}
            />
            <div>
              <div className="font-semibold text-sm">{info.label}</div>
              <div className="text-xs text-gray-500">{info.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomLegend;
