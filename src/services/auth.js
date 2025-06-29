// src/services/auth.js

import axios from "axios";

export const login = async (username, password) => {
  try {
    const { data } = await axios.post(
      "http://51.79.51.179:8000/api/v1/login",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.setItem("token", data.access_token);
    return true;
  } catch (error) {
    console.error(
      "Error en login:",
      error.response?.data || error.message
    );
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};