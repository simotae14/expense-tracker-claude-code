import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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

  const total = Object.values(totalsByCategory).reduce((sum, v) => sum + v, 0);

  const data = Object.entries(totalsByCategory)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return null;
  }

  const renderLabel = ({ value }) => `${((value / total) * 100).toFixed(0)}%`;

  return (
    <div className="category-chart">
      <h2>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#898781"} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart
