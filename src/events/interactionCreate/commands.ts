import { event, Events } from "../../utils/index";
import commands from "../../commands/index";
import { Command, EditReply, Reply } from "../../utils/index";
import { InteractionType, MessagePayload } from "discord.js";

const allCommands = commands.map(({ commands }) => commands).flat();
const allCommandsMap = new Map<string, Command>(
  allCommands.map((c) => [c.meta.name, c])
);

export default event(
  Events.InteractionCreate,
  async ({ log, client }, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      const commandName = interaction.commandName;
      const command = allCommandsMap.get(commandName);

      if (!command) throw new Error("[Command Error] Command not found.");

      await command.callback({
        client,
        interaction,
        log(...args) {
          log(`[${command.meta.name}]`, ...args);
        },
      });
    } catch (error) {
      log(`[Command Error]`, error);

      if (!interaction.deferred)
        return interaction.editReply(
          EditReply.error("Something went wrong :(((")
        );

      return interaction.reply(Reply.error("Something went wrong :((("));
    }
  }
);
