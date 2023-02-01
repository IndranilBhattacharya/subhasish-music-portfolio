import axios from "axios";

const youTubeAxios = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3/",
  params: {
    key: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY,
  },
  timeout: 10000,
});

export default youTubeAxios;
