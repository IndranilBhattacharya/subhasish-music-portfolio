import axios from "axios";
import Cookies from "universal-cookie";
import { SpotifyToken, SpotifyTrackResponse } from "../types";
import spotifyArtistAxios from "../config/spotifyArtistAxios";

const cookies = new Cookies();

const _SPOTIFY_ARTIST_ID = "4oDS347Lo7aB5SPu5wTXsH";

const generateSpotifyAccessToken = async (): Promise<SpotifyToken> => {
  const grantPayload = new URLSearchParams();
  grantPayload.append("grant_type", "client_credentials");
  return axios.post<any, SpotifyToken>(
    "https://accounts.spotify.com/api/token",
    grantPayload,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_SECRET}`,
          "binary"
        ).toString("base64")}`,
      },
    }
  );
};

const fetchArtistTopTracks = async (): Promise<SpotifyTrackResponse> => {
  const accessToken = cookies.get("_spaToken") ?? "";
  return spotifyArtistAxios.get<any, SpotifyTrackResponse>(
    `${_SPOTIFY_ARTIST_ID}/top-tracks`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: { market: "IN" },
    }
  );
};

export { fetchArtistTopTracks, generateSpotifyAccessToken };
