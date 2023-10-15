import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils/index";
import { getCategoryRoot } from "../../pages/help";

const meta = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows a list of all commands for the bot.");

export default command(meta, ({ interaction }) => {
  return interaction.reply(getCategoryRoot(true));
});
