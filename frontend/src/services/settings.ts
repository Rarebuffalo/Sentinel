import API from "./api";

export interface UserSettings {
  id: number;
  user_id: number;
  email_alerts: boolean;
  slack_alerts: boolean;
  discord_alerts: boolean;
  slack_webhook_url: string;
  discord_webhook_url: string;
  global_latency_threshold: number;
  global_failure_tolerance: number;
}

export interface ApiKey {
  id: number;
  key: string;
  created_at: string;
}

export const settingsService = {
  getSettings: async (): Promise<UserSettings> => {
    const res = await API.get("/settings/");
    return res.data;
  },
  
  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const res = await API.put("/settings/", settings);
    return res.data;
  },
  
  getApiKeys: async (): Promise<ApiKey[]> => {
    const res = await API.get("/settings/apikeys");
    return res.data;
  },
  
  generateApiKey: async (): Promise<ApiKey> => {
    const res = await API.post("/settings/apikeys");
    return res.data;
  },
  
  deleteApiKey: async (id: number): Promise<void> => {
    await API.delete(`/settings/apikeys/${id}`);
  }
};
