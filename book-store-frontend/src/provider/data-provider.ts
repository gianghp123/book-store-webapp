// provider/data-provider.ts
import {
  createAction,
  deleteOneAction,
  getListAction,
  getOneAction,
  updateAction,
} from "@/lib/provider-actions/data-provider.actions";
import { DataProvider } from "@refinedev/core";

export const dataProvider = (withCredentials=true): DataProvider => ({
  getOne: async ({ id, resource, meta }) => {
    return await getOneAction({ id, resource, meta, withCredentials });
  },

  create: async ({ resource, variables, meta }) => {
    // ✅ Cast to satisfy TypeScript
    return await createAction({
      resource,
      variables: variables as Record<string, any>,
      meta,
      withCredentials,
    });
  },

  update: async ({ id, resource, variables, meta }) => {
    // ✅ Cast to satisfy TypeScript
    return await updateAction({
      id,
      resource,
      variables: variables as Record<string, any>,
      meta,
      withCredentials,
    });
  },

  deleteOne: async ({ id, resource, meta }) => {
    return await deleteOneAction({ id, resource, meta, withCredentials });
  },

  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    return await getListAction({
      resource,
      pagination,
      sorters,
      filters,
      meta,
      withCredentials,
    });
  },

  getApiUrl: () => process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "",
});
