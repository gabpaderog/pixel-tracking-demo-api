import axios from "axios";

export const ipClient = axios.create({
  baseURL: process.env.IP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
