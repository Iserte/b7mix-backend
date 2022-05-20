import "dotenv/config";
import "reflect-metadata";

import express from "./express";

import defaultDataSource from "./database";

import "./socketio";

const EXPRESS_PORT = process.env.EXPRESS_PORT as unknown as number || 8080;

// Start database
defaultDataSource.initialize().then(() => {
  // Start web server
  express.listen(EXPRESS_PORT, () => console.log(`Rodando em http://localhost:${EXPRESS_PORT}/`));
});
