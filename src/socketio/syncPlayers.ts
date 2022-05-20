/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import DataSource from "../database"
import { Player } from "../database/entity/player.entity"
import CreateMatch from "./createMatch";
import IsMatchRunning from "./isMatchRunning";
import SyncMatch from "./syncMatch";

interface syncDataInterface {
  isMatchRunning?: boolean,
  players?: Array<accountDataInterface>
}

interface matchDataInterface {
  isMatchRunning?: boolean,
  teamAName: string,
  teamA?: Array<accountDataInterface>,
  teamBName: string,
  teamB?: Array<accountDataInterface>,
}

interface accountDataInterface {
  avatar?: string | undefined,
  avatarfull?: string | undefined,
  avatarhash?: string | undefined,
  avatarmedium?: string | undefined,
  commentpermission?: string | undefined,
  communityvisibilitystate?: string | undefined,
  lastlogoff?: string | undefined,
  loccityid?: string | undefined,
  loccountrycode?: string | undefined,
  locstatecode?: string | undefined,
  personaname?: string | undefined,
  personastate?: string | undefined,
  personastateflags?: string | undefined,
  primaryclanid?: string | undefined,
  profilestate?: string | undefined,
  profileurl?: string | undefined,
  steamid: string,
  timecreated?: string | undefined,
}

export default async function SyncPlayers(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, matchPlayers: matchDataInterface | undefined = undefined) {
  const playerRepository = DataSource.getRepository(Player);
  const players = (await playerRepository.find()) as accountDataInterface[];

  const isMatchRunning = await IsMatchRunning();

  const syncData = {
    isMatchRunning,
    players
  } as syncDataInterface

  // Se existir uma partida,sera emitido o evento para sincronizar os jogadores
  if (isMatchRunning) {
    return SyncMatch(server)
  }

  // Se NÃO existir uma partida e houver mais de 10 jogadores na fila, sera criado uma partida e emitido o evento para sincronizar os jogadores
  if (players.length >= 2) {
    await CreateMatch(server);

    return SyncMatch(server)
  }

  // Se NAO existir uma partida e nao houver 10 ou mais jogadores na fila, sera emitido o evento para sincronizar os jogadores
  return server.sockets.emit("syncPlayers", syncData)
}