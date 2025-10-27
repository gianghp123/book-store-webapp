// src/provider/public-data-provider.ts
import { apiFetch } from "@/lib/api-fetch";
import { DataProvider } from "@refinedev/core";

export const dataProvider = (): DataProvider => ({
  getOne: async ({ id, resource, }) => {
    const { data } = await apiFetch(`/${resource}/${id}`);
      return {
          data,
      };
  },

  // CẬP NHẬT PHƯƠNG THỨC NÀY (Bỏ "Not implemented")
  create: async ({ resource, variables }) => {
    // Gọi apiFetch với endpoint và dữ liệu
    const { data, success, message } = await apiFetch(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });

    if (!success) {
      // Refine mong muốn nhận lỗi khi thất bại
      throw new Error(message || "Tạo mới thất bại");
    }

    return {
      data, // Trả về { data: { accessToken: "..." } }
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
    const sort = sorters?.[0]

    const response = await apiFetch(`/${resource}`, {
      query: {
        page: currentPage,
        limit: pageSize,
        sortBy: sort?.field,
        sortOrder: sort?.order,
      },
    })

    return {
      data: response.data,
      total: response.pagination?.total || 0,
    }
  },
  getApiUrl: () => process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '',
});