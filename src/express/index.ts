import express from "express";
import session from "express-session";
import cors from "cors";
import http from "http";

import passport from "../utils/passport";
import routes from "./routes";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET || "SECRET",
  name: process.env.EXPRESS_SESSION_NAME || "CSGO",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.use("/download", express.static("public"));

export default server;
