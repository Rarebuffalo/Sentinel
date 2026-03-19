import API from "./api";

export interface Endpoint {
  id: number;
  name: string;
  url: string;
  method: string;
  interval: number;
  is_active: boolean;
  created_at: string;
  last_status?: string;
  last_response_time?: number;
  last_checked_at?: string;
}

export const endpointsService = {
  getAll: async () => {
    const { data } = await API.get("/endpoints/");
    return data;
  },

  create: async (endpointData: any) => {
    const { data } = await API.post("/endpoints/", endpointData);
    return data;
  },

  update: async (id: number, endpointData: any) => {
    const { data } = await API.put(`/endpoints/${id}`, endpointData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await API.delete(`/endpoints/${id}`);
    return data;
  },

  toggleActive: async (id: number, isActive: boolean) => {
    const { data } = await API.put(`/endpoints/${id}`, { is_active: isActive });
    return data;
  },

  manualCheck: async (id: number) => {
    const { data } = await API.post(`/endpoints/${id}/check`);
    return data;
  }
};
