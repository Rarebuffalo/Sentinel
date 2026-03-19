import API from "./api";

export interface AlertEndpoint {
  id: number;
  name: string;
  url: string;
}

export interface Alert {
  id: number;
  message: string;
  is_resolved: boolean;
  created_at: string;
  endpoint: AlertEndpoint;
}

export const alertsService = {
  getAll: async () => {
    const { data } = await API.get("/alerts/");
    return data;
  }
};
