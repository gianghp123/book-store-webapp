// src/features/dashboard/dtos/response/dashboard-response.dto.ts

// Dashboard statistics response (giữ nguyên)
export interface DashboardStatsResponse {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

// Sales over time data point (giữ nguyên)
export interface SalesDataPoint {
  date: string; // Tên tháng ngắn (Jan, Feb,...)
  sales: number;
}

// Sales over time response (giữ nguyên)
export interface SalesOverTimeResponse extends Array<SalesDataPoint> {}

// === THÊM / KIỂM TRA DTO NÀY ===
// Category sales data point
export interface CategorySalesDataPoint {
    name: string; // Tên danh mục (hoặc 'Others')
    value: number; // Tỷ lệ phần trăm
    // color?: string; // Frontend sẽ tự thêm màu nếu cần
}

// Sales by category response
export interface SalesByCategoryResponse extends Array<CategorySalesDataPoint> {}
// === KẾT THÚC THÊM / KIỂM TRA ===