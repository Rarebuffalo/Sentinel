import API from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const res = await API.post("/login", { email, password });
    if (res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);
    }
    return res.data;
  },
  
  register: async (email: string, password: string) => {
    const res = await API.post("/register", { email, password });
    return res.data;
  },

  getMe: async () => {
    const res = await API.get("/me");
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }
};
