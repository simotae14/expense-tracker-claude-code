import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';

const CATEGORY_COLORS = {
  food: "#2a78d6",
  housing: "#1baf7a",
  utilities: "#eda100",
  transport: "#008300",
  entertainment: "#4a3aa7",
  salary: "#e34948",
  other: "#e87ba4",
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
          <CartesianGrid vertical={false} stroke="#e1e0d9" />
          <XAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 13, fill: "#0b0b0b" }}
            axisLine={{ stroke: "#c3c2b7" }}
            tickLine={false}
          />
          <YAxis type="number" tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
          <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#898781"} />
            ))}
            <LabelList dataKey="total" position="top" formatter={(value) => `$${value}`} fill="#0b0b0b" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart
