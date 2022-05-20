/* eslint-disable @typescript-eslint/ban-types */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import Rcon from "rcon-ts";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import IsMatchRunning from "./isMatchRunning";

import DataSource from "../database"
import { Player } from "../database/entity/player.entity"
import SyncPlayers from "./syncPlayers";

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
  players: Array<string | {}>
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

export default async function CreateMatch(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
  if (await IsMatchRunning())
    return;

  const playerRepository = DataSource.getRepository(Player);
  const players = (await playerRepository.find({ take: 10 })) as accountDataInterface[];

  const rcon = new Rcon({
    host: process.env.RCON_ADDRESS || "localhost",
    password: process.env.RCON_PASSWORD || "",
    port: 27015,
    timeout: 9999999
  });
  await rcon.connect();

  const matchUsers = players.map(s => ({ steamid: s.steamid, personaname: s.personaname }));

  const playersCount = matchUsers.length;
  let playersPerTeam = playersCount / 2;

  const teamA: { personaname?: string, steamid: string }[] = [];

  for (let i = 0; i < playersPerTeam; i++) {
    const randomIndex = Math.floor(Math.random() * matchUsers.length);
    teamA.push(matchUsers.splice(randomIndex, 1)[0]);
  }
  const teamB = matchUsers;

  const get5DirPath = path.resolve("/", "csgo_ds", "csgo", "addons", "sourcemod", "configs", "get5");
  const get5TemplatePath = path.resolve(get5DirPath, "match_template.json");
  const get5MatchPath = path.resolve(get5DirPath, "match_mix.json");

  const get5MatchTemplate = JSON.parse(
    readFileSync(
      get5TemplatePath,
      "utf-8"
    )
  ) as matchInterface;

  const teamAName = `Time de ${teamA[0]?.personaname || ""}`;
  get5MatchTemplate.team1.name = teamAName;
  teamA.forEach(member => {
    get5MatchTemplate.team1.players.push(member.steamid);
  });
  const teamBName = `Time de ${teamB[0]?.personaname || ""}`;
  get5MatchTemplate.team2.name = teamBName;
  teamB.forEach(member => {
    get5MatchTemplate.team2.players.push(member.steamid);
  });

  writeFileSync(get5MatchPath, JSON.stringify(get5MatchTemplate));

  rcon.send("get5_loadmatch addons\\sourcemod\\configs\\get5\\match_mix.json");

  SyncPlayers(server)

}
