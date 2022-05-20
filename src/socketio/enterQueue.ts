/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
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

export default async function EnterQueue(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, accountData: accountDataInterface) {
  const playerRepository = DataSource.getRepository(Player);
  let players = (await playerRepository.find()) as accountDataInterface[];

  if (players.find(p => p.steamid === accountData.steamid))
    return server.sockets.emit("syncPlayers", players);

  const player = new Player()
  player.avatar = accountData.avatar,
  player.avatarfull = accountData.avatarfull
  player.avatarhash = accountData.avatarhash
  player.avatarmedium = accountData.avatarmedium
  player.commentpermission = accountData.commentpermission
  player.communityvisibilitystate = accountData.communityvisibilitystate
  player.lastlogoff = accountData.lastlogoff
  player.loccityid = accountData.loccityid
  player.loccountrycode = accountData.loccountrycode
  player.locstatecode = accountData.locstatecode
  player.personaname = accountData.personaname
  player.personastate = accountData.personastate
  player.personastateflags = accountData.personastateflags
  player.primaryclanid = accountData.primaryclanid
  player.profilestate = accountData.profilestate
  player.profileurl = accountData.profileurl
  player.steamid = accountData.steamid
  player.timecreated = accountData.timecreated

  await playerRepository.save(player)

  SyncPlayers(server)
}