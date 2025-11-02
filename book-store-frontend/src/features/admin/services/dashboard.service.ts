import { apiFetch } from "@/lib/api-fetch";
import { DashboardStatsResponse, SalesOverTimeResponse, SalesByCategoryResponse } from "@/features/admin/dtos/response/dashboard-response.dto";
import { ServerResponseModel } from "@/lib/typedefs/server-response";

export const dashboardService = {
  async getStats(): Promise<ServerResponseModel<DashboardStatsResponse>> {
    // ... (hàm getStats giữ nguyên) ...
    const response = await apiFetch<DashboardStatsResponse>("/dashboard/stats", {
        method: "GET",
        withCredentials: true,
      });
      return response;
  },

  async getSalesOverTime(): Promise<ServerResponseModel<SalesOverTimeResponse>> {
    // ... (hàm getSalesOverTime giữ nguyên) ...
    const response = await apiFetch<SalesOverTimeResponse>("/dashboard/sales-over-time", {
        method: "GET",
        withCredentials: true,
    });
    return response;
  },

  // === THÊM HÀM MỚI NÀY ===
  /**
   * Lấy dữ liệu doanh số phân theo danh mục (top 4 + others).
   * Yêu cầu quyền ADMIN.
   */
  async getSalesByCategory(): Promise<ServerResponseModel<SalesByCategoryResponse>> {
      // Gọi apiFetch tới endpoint /dashboard/sales-by-category
      const response = await apiFetch<SalesByCategoryResponse>("/dashboard/sales-by-category", {
          method: "GET",
          withCredentials: true, // Đảm bảo gửi token xác thực
      });
      return response;
  }
  // === KẾT THÚC HÀM MỚI ===
};