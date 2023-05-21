import axios from "axios";

const client = axios.create({
  baseURL: "https://movierate-backend-k389l.ondigitalocean.app/api",
});

export default client;
