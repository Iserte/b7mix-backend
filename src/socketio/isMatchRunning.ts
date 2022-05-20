import Rcon from "rcon-ts";

export default async function IsMatchRunning() {
  const rcon = new Rcon({
    host: process.env.RCON_ADDRESS || "localhost",
    password: process.env.RCON_PASSWORD || "",
    port: 27015,
    timeout: 9999999
  });
  await rcon.connect();
  const res = await rcon.send("get5_status");
  const resData = JSON.parse(res.substring(0, res.search(/\nL \d+/g)));

  const isMatchRunning = resData.gamestate !== 0

  return isMatchRunning
}