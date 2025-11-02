// provider/data-provider.ts
import {
  createAction,
  deleteOneAction,
  getListAction,
  getOneAction,
  updateAction,
} from "@/lib/provider-actions/data-provider.actions";
import { DataProvider } from "@refinedev/core";

export const dataProvider = (withCredentials: boolean): DataProvider => ({
  getOne: async ({ id, resource, meta }) => {
    return await getOneAction({ id, resource, meta });
  },

  create: async ({ resource, variables, meta }) => {
    // ✅ Cast to satisfy TypeScript
    return await createAction({
      resource,
      variables: variables as Record<string, any>,
      meta,
    });
  },

  update: async ({ id, resource, variables, meta }) => {
    // ✅ Cast to satisfy TypeScript
    return await updateAction({
      id,
      resource,
      variables: variables as Record<string, any>,
      meta,
    });
  },

  deleteOne: async ({ id, resource, meta }) => {
    return await deleteOneAction({ id, resource, meta });
  },

  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    return await getListAction({
      resource,
      pagination,
      sorters,
      filters,
      meta,
    });
  },

  getApiUrl: () => process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "",
});
