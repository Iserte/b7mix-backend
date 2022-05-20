/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { readFileSync } from "fs";
import path from "path";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface matchDataInterface {
  teamAName: string | undefined,
  teamA: accountDataInterface[],
  teamBName: string | undefined,
  teamB: accountDataInterface[]
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

interface matchInterface {
  matchid: string;
  num_maps: number;
  players_per_team: number;
  min_players_to_ready: number,
  min_spectators_to_ready: number,
  skip_veto: boolean,
  veto_first: string,
  side_type: string,
  match_title: string,
  maplist: Array<string>,
  team1: teamInterface,
  team2: teamInterface
}

interface teamInterface {
  name: string,
  tag: string,
  flag: string,
  logo: string,
  players: any[]
}

export default async function SyncMatch(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
  const get5DirPath = path.resolve("/", "csgo_ds", "csgo", "addons", "sourcemod", "configs", "get5");
  const get5MatchPath = path.resolve(get5DirPath, "match_mix.json");

  const get5Match = JSON.parse(
    readFileSync(
      get5MatchPath,
      "utf-8"
    )
  ) as matchInterface;

  const teamAData = (await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${get5Match.team1.players.join(",")}`)).data.response
  const teamBData = (await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${get5Match.team2.players.join(",")}`)).data.response

  const matchData = {
    teamAName: get5Match.team1.name,
    teamBName: get5Match.team2.name,
    teamA: teamAData.players,
    teamB: teamBData.players,
  } as matchDataInterface

  return server.sockets.emit("syncMatch", matchData)
}