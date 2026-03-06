import axios from "axios";
import { getAuthToken } from "./authService";

const API = axios.create({
  baseURL: "http://localhost:5000/api/recruiter",
});

API.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${getAuthToken()}`;
  return req;
});

export const verifyRecruiter = (data) => API.post("/verify", data);
export const getCompanyCatalog = (page = 1, limit = 4) =>
  API.get(`/companies?page=${page}&limit=${limit}`);
export const getRecruiterProfile = () => API.get("/me");
export const postInternship = (data) => API.post("/post", data);
export const getApplications = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const query = params.toString();
  return API.get(`/applications${query ? `?${query}` : ""}`);
};
export const updateApplicationStatus = (applicationId, status) =>
  API.patch(`/applications/${applicationId}/status`, { status });
export const extendOffer = (applicationId, formData) =>
  API.patch(`/applications/${applicationId}/extend-offer`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const selectStudent = (internshipId, studentId) =>
  API.put(`/select/${internshipId}/${studentId}`);