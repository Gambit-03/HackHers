import axios from "axios";

// Create an axios instance with base URL and JSON headers
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: { "Content-Type": "application/json" }
});

export const getAuthToken = () => sessionStorage.getItem("token");

export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem("token", token);
  }
};

export const clearAuthToken = () => {
  sessionStorage.removeItem("token");
};

// Register user
export const registerUser = async (payload) => {
  return await API.post("/register", payload);
};

// Login user
export const loginUser = async (payload) => {
  return await API.post("/login", payload);
};

// Fetch currently logged-in user
export const getCurrentUser = async () => {
  const token = getAuthToken();

  return await API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCurrentUser = async (payload) => {
  const token = getAuthToken();

  return await API.put("/me", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logoutUser = async () => {
  const token = getAuthToken();
  return await API.post("/logout", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};