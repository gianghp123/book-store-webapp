"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, DollarSign, ShoppingCart, Users } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for analytics
const salesData = [
  { month: "Jan", sales: 4500, orders: 45 },
  { month: "Feb", sales: 5200, orders: 52 },
  { month: "Mar", sales: 6800, orders: 68 },
  { month: "Apr", sales: 7200, orders: 72 },
  { month: "May", sales: 8500, orders: 85 },
  { month: "Jun", sales: 9200, orders: 92 },
];

const categoryData = [
  { name: "Fiction", value: 35, color: "#3b82f6" },
  { name: "Non-Fiction", value: 25, color: "#10b981" },
  { name: "Science", value: 20, color: "#f59e0b" },
  { name: "History", value: 12, color: "#ef4444" },
  { name: "Others", value: 8, color: "#8b5cf6" },
];

const topProducts = [
  { id: "1", title: "The Great Gatsby", sales: 145, revenue: 2175 },
  { id: "2", title: "1984", sales: 132, revenue: 1980 },
  { id: "3", title: "To Kill a Mockingbird", sales: 128, revenue: 1920 },
  { id: "4", title: "Pride and Prejudice", sales: 115, revenue: 1725 },
  { id: "5", title: "The Catcher in the Rye", sales: 98, revenue: 1470 },
];

const recentOrders = [
  {
    id: "1",
    customer: "John Doe",
    amount: 125.5,
    status: "Completed",
    date: "2024-10-24",
  },
  {
    id: "2",
    customer: "Jane Smith",
    amount: 89.99,
    status: "Processing",
    date: "2024-10-24",
  },
  {
    id: "3",
    customer: "Bob Johnson",
    amount: 245.0,
    status: "Shipped",
    date: "2024-10-23",
  },
  {
    id: "4",
    customer: "Alice Williams",
    amount: 67.5,
    status: "Completed",
    date: "2024-10-23",
  },
  {
    id: "5",
    customer: "Charlie Brown",
    amount: 156.75,
    status: "Processing",
    date: "2024-10-22",
  },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to your bookstore management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$41,400</div>
            <p className="text-xs text-gray-600 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">414</div>
            <p className="text-xs text-gray-600 mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Products</CardTitle>
            <BookOpen className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">1,248</div>
            <p className="text-xs text-gray-600 mt-1">+24 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Users</CardTitle>
            <Users className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">2,845</div>
            <p className="text-xs text-gray-600 mt-1">+18.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Sales ($)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: PieLabelRenderProps) =>
                    `${name}: ${((percent as number) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p>{product.title}</p>
                      <p className="text-sm text-gray-600">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-green-600">${product.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p>{order.customer}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>${order.amount}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
