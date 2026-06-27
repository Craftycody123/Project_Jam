import axiosInstance from "../utils/axiosInstance";

export const authAPI = {
  register: (name, email, password) =>
    axiosInstance.post("/auth/register", { name, email, password }),

  login: (email, password) =>
    axiosInstance.post("/auth/login", { email, password }),

  getMe: () =>
    axiosInstance.get("/auth/me"),

  getProfile: () =>
    axiosInstance.get("/profile"),

  updateProfile: (data) =>
    axiosInstance.put("/profile", data),
};

export const garmentAPI = {
  getGarments: () =>
    axiosInstance.get("/garments/"),

  uploadGarment: (data) =>
    axiosInstance.post("/garments/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getGarment: (id) =>
    axiosInstance.get(`/garments/${id}`),

  updateGarment: (id, data) =>
    axiosInstance.put(`/garments/${id}`, data),

  deleteGarment: (id) =>
    axiosInstance.delete(`/garments/${id}`),
};

export const recommendationAPI = {
  generateRecommendation: (data) =>
    axiosInstance.post("/recommendations/generate", data),

  saveManualOutfit: (data) =>
    axiosInstance.post("/recommendations/save-manual", data),

  // Works for both recommended and manual outfits:
  // - recommended: pass { recommendation_id, feedback }
  // - manual: pass { garment_ids, feedback }
  submitFeedback: (data) =>
    axiosInstance.post("/recommendations/feedback", data),

  getHistory: () =>
    axiosInstance.get("/recommendations/history"),
};

export const weatherAPI = {
  getWeather: (lat, lon) =>
    axiosInstance.get("/weather/", { params: { lat, lon } }),

  getWeatherByCity: () =>
    axiosInstance.get("/weather/by-city"),
};