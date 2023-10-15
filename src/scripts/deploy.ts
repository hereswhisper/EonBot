import { REST, Routes, APIUser } from "discord.js";
import commands from "../commands";
import { getEnv } from "../utils";

const body = commands
  .map(({ commands }) => commands.map(({ meta }) => meta))
  .flat();

const rest = new REST({ version: "10" }).setToken(getEnv("TOKEN"));

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint =
    process.env.NODE_ENV === "production"
      ? Routes.applicationCommands(currentUser.id)
      : Routes.applicationGuildCommands(currentUser.id, getEnv("GUILD"));

  await rest.put(endpoint, { body });

  return currentUser;
}

main()
  .then((user) => {
    const username = `${user.username}`;
    const response =
      process.env.NODE_ENV === "production"
        ? `Successfully released commands in production as ${username}!`
        : `Successfully registered commands for development in ${getEnv(
            "GUILD"
          )} as ${username}!`;

    console.log(response);
  })
  .catch(console.error);
