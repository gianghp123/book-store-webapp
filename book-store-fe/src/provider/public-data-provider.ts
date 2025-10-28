import { apiFetch } from "@/lib/api-fetch";
import { DataProvider } from "@refinedev/core";

export const dataProvider = (): DataProvider => ({
  getOne: async ({ id, resource }) => {
    const { data } = await apiFetch(`/${resource}/${id}`);
      return {
        data,
      };
  },

  create: async () => {
      throw new Error("Not implemented");
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

    console.log(response)

    return {
      data: response.data,
      total: response.pagination?.total || 0,
    }
  },
  getApiUrl: () => process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '',
});