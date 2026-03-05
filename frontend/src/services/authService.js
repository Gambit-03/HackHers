import axios from "axios";

// Create an axios instance with base URL and JSON headers
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: { "Content-Type": "application/json" }
});

// Register user
export const registerUser = async (payload) => {
  return await API.post("/register", payload);
};

// Login user
export const loginUser = async (payload) => {
  return await API.post("/login", payload);
};