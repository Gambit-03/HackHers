import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/recruiter",
});

API.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return req;
});

export const verifyRecruiter = (data) => API.post("/verify", data);
export const postInternship = (data) => API.post("/post", data);
export const getApplications = () => API.get("/applications");
export const selectStudent = (internshipId, studentId) =>
  API.put(`/select/${internshipId}/${studentId}`);