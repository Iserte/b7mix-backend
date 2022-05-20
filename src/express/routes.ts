import { Request, Response, Router } from "express";
import passport from "../utils/passport";

import eventListener from "../statslistener";

const FRONTEND_URL = process.env.FRONTEND_URL;

const routes = Router();

routes.all("*", eventListener);

routes.get("/logout", (req: Request, res: Response) => {
  req.logout();
  res.json({ index: true });
});

routes.get(
  "/auth/steam",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    const { id: steamid } = req.user as any;
    res.redirect(`${FRONTEND_URL}?steamid=${steamid}`);
  }
);

export default routes;
