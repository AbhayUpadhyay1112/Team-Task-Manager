import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-jsrq.onrender.com",
});

export default API;