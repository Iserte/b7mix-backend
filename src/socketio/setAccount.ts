/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Socket } from "socket.io";

export default async function SetAccount(socket: Socket, steamid: string) {
  const { data } = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamid}`);

  socket.handshake.auth = data.response.players[0];

  socket.emit("setAccount", data.response.players[0]);
}