/* eslint-disable @typescript-eslint/ban-types */
import { Server } from "socket.io";
import express from "../express";

import EnterQueue from "./enterQueue";
import LeaveQueue from "./leaveQueue";
import SetAccount from "./setAccount";
import SyncPlayers from "./syncPlayers";

interface accountDataInterface {
  avatar: string | undefined,
  avatarfull: string | undefined,
  avatarhash: string | undefined,
  avatarmedium: string | undefined,
  commentpermission: string | undefined,
  communityvisibilitystate: string | undefined,
  lastlogoff: string | undefined,
  loccityid: string | undefined,
  loccountrycode: string | undefined,
  locstatecode: string | undefined,
  personaname: string | undefined,
  personastate: string | undefined,
  personastateflags: string | undefined,
  primaryclanid: string | undefined,
  profilestate: string | undefined,
  profileurl: string | undefined,
  steamid: string,
  timecreated: string | undefined,
}

const server = new Server(express, {
  cors: {
    origin: "*"
  }
});

server.on("connection", async (socket) => {
  console.log(`Nova conexão [STEAMID]: ${socket.handshake.auth.steamid}`);

  const { auth } = socket.handshake as any;
  const { steamid } = auth;
  if (!steamid) return;

  // Entra na fila
  socket.on("enterQueue", async (accountData: accountDataInterface) => { EnterQueue(server, accountData); });

  // Sai da fila
  socket.on("leaveQueue", async (accountData: accountDataInterface) => { LeaveQueue(server, accountData.steamid); });

  // Sincroniza os usuarios com cada cliente
  socket.on("syncPlayers", async (socket) => { SyncPlayers(server); });

  // Sincroniza os usuarios quando um cliente se desconectar
  socket.on("disconnect", async () => { LeaveQueue(server, socket.handshake.auth.steamid); });

  // Envia o steamid para o cliente
  SetAccount(socket, steamid);
});

