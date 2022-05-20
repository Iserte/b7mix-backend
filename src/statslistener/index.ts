import { NextFunction, Request, Response } from "express";
// import { matchStats } from "../socketio";

function eventListener(req: Request, res: Response, next: NextFunction) {
  req.on("data", (chunk) => {
    const eventString = chunk.toString("utf-8") as string;
    if(eventString.match(/get5_event/g)) {
      const cuttedEventString = eventString
        .replace(/[\d]+\/[^{\n]+/g, "")
        .replace(/}\n+{/g,"},{");
        
      const events = JSON.parse(`[${cuttedEventString}]`);
      for (const event of events) {
        console.log(event);
        // matchStats(event);
      }
    }
  });

  if (req.headers["user-agent"] === "Valve/Steam HTTP Client 1.0 (730)") {
    res.sendStatus(200);
  }
  
  next();
}

export default eventListener;
