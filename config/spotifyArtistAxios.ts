import axios from "axios";

const spotifyArtistAxios = axios.create({
  baseURL: "https://api.spotify.com/v1/artists/",
  timeout: 10000,
});

export default spotifyArtistAxios;
