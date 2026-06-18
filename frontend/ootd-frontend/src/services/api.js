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
    axiosInstance.get("/garments"),
  
  createGarment: (data) =>
    axiosInstance.post("/garments", data),
  
  deleteGarment: (id) =>
    axiosInstance.delete(`/garments/${id}`),
};

export const recommendationAPI = {
  getRecommendations: () =>
    axiosInstance.get("/recommendations"),
  
  createRecommendation: (data) =>
    axiosInstance.post("/recommendations", data),
};