import { apiFetch } from "@/lib/api-fetch";
import { DataProvider } from "@refinedev/core";

export const dataProvider = (): DataProvider => ({
  getOne: async ({ id, resource }) => {
    const { data } = await apiFetch(`/${resource}/${id}`);
    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const { data, success, message } = await apiFetch(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });

    if (!success) {
      throw new Error(message || "Tạo mới thất bại");
    }

    return {
      data,
    };
  },

  update: async () => {
    throw new Error("Not implemented");
  },
  deleteOne: async () => {
    throw new Error("Not implemented");
  },

  getList: async ({ resource, pagination, sorters }) => {
    const { currentPage = 1, pageSize = 10 } = pagination ?? {};
    const sort = sorters?.[0];

    const response = await apiFetch(`/${resource}`, {
      query: {
        page: currentPage,
        limit: pageSize,
        sortBy: sort?.field,
        sortOrder: sort?.order,
      },
    });

    // Thêm log để kiểm tra response từ apiFetch
    console.log(`dataProvider getList response for resource "${resource}":`, response);

    // Đảm bảo trả về cấu trúc { data: [], total: number }
    return {
      data: response.data || [], // Lấy mảng dữ liệu
      total: response.pagination?.total || response.data?.length || 0, // Lấy tổng số lượng
    };
  },

  getApiUrl: () => process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '',
});