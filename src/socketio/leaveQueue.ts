/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import DataSource from "../database"
import { Player } from "../database/entity/player.entity"
import SyncPlayers from "./syncPlayers";

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

export default async function LeaveQueue(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, steamid: string) {
  const playerRepository = DataSource.getRepository(Player);
  const player = (await playerRepository.findOneBy({ steamid: steamid })) as accountDataInterface;

  if (player)
    await playerRepository.delete(player)

  SyncPlayers(server)
}