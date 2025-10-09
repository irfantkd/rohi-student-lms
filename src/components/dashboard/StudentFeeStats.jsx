import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#014376", "#CD2532"]; 

const StudentFeeStats = ({ data }) => {
  // Expecting data like: { paid: 120, unpaid: 80 }
  const chartData = [
    { name: "Paid", value: data?.paid || 0 },
    { name: "Unpaid", value: data?.unpaid || 0 },
  ];

  return (
<>
      
    <div className=" w-full xl:w-[95%] h-[400px] p-4 bg-white shadow rounded-xl overflow-scroll md:overflow-visible">
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
</>
  );
};

export default StudentFeeStats;
