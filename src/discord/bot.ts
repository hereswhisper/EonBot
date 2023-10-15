import { Client, GatewayIntentBits } from "discord.js";
import Globals from "../globals";
import { getEnv, registerEvents } from "../utils/index";
import Events from "../events/index";

import mongoose from "mongoose";

const DB_URL = getEnv("DATABASE_URL");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

registerEvents(client, Events);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("[DATABASE]: Connected to MongoDB!");
  })
  .catch((error) => {
    console.log(`[DATABASE_ERROR]: ${error}`);
    throw error;
  });

client.login(Globals.token).catch((error) => {
  console.log(`[LOGIN_ERROR]: ${error}`);
  process.exit(1);
});
