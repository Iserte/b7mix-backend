/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default async function Disconnect(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
  io.sockets.emit("syncPlayers", (await io.fetchSockets()).map(m => m.handshake.auth));
  return true;
}