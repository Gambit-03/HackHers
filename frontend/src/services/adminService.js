import axios from "axios";
import { getAuthToken } from "./authService";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

API.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${getAuthToken()}`;
  return req;
});

export const getAdminRecruiters = () => API.get("/recruiters");
export const getAdminCompanies = () => API.get("/companies");
export const getAdminAnalytics = () => API.get("/analytics");
export const downloadAdminReport = (reportType) =>
  API.get(`/reports/${reportType}`, { responseType: "blob" });
