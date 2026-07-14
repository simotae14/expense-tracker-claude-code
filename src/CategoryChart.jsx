import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';

const CATEGORY_COLORS = {
  food: "#b8842f",
  housing: "#1f6fb0",
  utilities: "#c9691f",
  transport: "#5a4a8f",
  entertainment: "#1f8f78",
  salary: "#af3b3b",
  other: "#2f7a4f",
};

function CategoryChart({ transactions }) {
  const totalsByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const data = Object.entries(totalsByCategory)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="category-chart">
      <h2>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid vertical={false} stroke="#e4ddcc" />
          <XAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 13, fill: "#1b3a2f", fontFamily: "Inter, sans-serif" }}
            axisLine={{ stroke: "#c9bfa5" }}
            tickLine={false}
          />
          <YAxis type="number" tick={{ fontSize: 12, fill: "#6b8577", fontFamily: "Inter, sans-serif" }} axisLine={{ stroke: "#c9bfa5" }} tickLine={false} />
          <Tooltip
            formatter={(value) => [`$${value}`, "Spent"]}
            contentStyle={{ background: "#ffffff", border: "1px solid #e4ddcc", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 13 }}
            cursor={{ fill: "rgba(184, 132, 47, 0.06)" }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#898781"} />
            ))}
            <LabelList dataKey="total" position="top" formatter={(value) => `$${value}`} fill="#1b3a2f" fontSize={12} fontFamily="IBM Plex Mono, monospace" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart
