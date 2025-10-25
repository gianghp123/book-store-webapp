// Dashboard statistics response
export interface DashboardStatsResponse {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

// Sales over time data point
export interface SalesDataPoint {
  date: string;
  sales: number;
}

// Sales over time response
export interface SalesOverTimeResponse extends Array<SalesDataPoint> {}