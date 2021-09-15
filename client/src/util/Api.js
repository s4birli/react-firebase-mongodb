import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://us-central1-fa-backend.cloudfunctions.net/app",
  // baseURL: "http://g-axon.work/jwtauth/api",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
