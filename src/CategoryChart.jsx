import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';

const CATEGORY_COLORS = {
  food: "#3987e5",
  housing: "#199e70",
  utilities: "#c98500",
  transport: "#008300",
  entertainment: "#9085e9",
  salary: "#e66767",
  other: "#d95926",
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
      <p className="section-label">spend_by_category</p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid vertical={false} stroke="#262f2a" />
          <XAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 12, fill: "#e7ede9", fontFamily: "JetBrains Mono, monospace" }}
            axisLine={{ stroke: "#384039" }}
            tickLine={false}
          />
          <YAxis
            type="number"
            tick={{ fontSize: 11, fill: "#7c8a83", fontFamily: "JetBrains Mono, monospace" }}
            axisLine={{ stroke: "#384039" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`$${value}`, "Spent"]}
            contentStyle={{ background: "#191d1a", border: "1px solid #384039", borderRadius: 4, fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}
            labelStyle={{ color: "#e7ede9" }}
            cursor={{ fill: "rgba(166, 226, 46, 0.06)" }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#7c8a83"} />
            ))}
            <LabelList dataKey="total" position="top" formatter={(value) => `$${value}`} fill="#e7ede9" fontSize={12} fontFamily="JetBrains Mono, monospace" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart
