import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command } from "../../utils/index";
import { registeredUsers } from "./register";
import bcrypt from "bcrypt";
import User from "../../models/User";

const meta = new SlashCommandBuilder()
  .setName("changepassword")
  .setDescription("Change your account's password")
  .addStringOption((option) =>
    option
      .setName("password")
      .setDescription("Your new account password.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("email")
      .setDescription("Enter your account's email")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  await interaction.deferReply({ ephemeral: true });

  const email = interaction.options.getString("email") as string;
  const password = interaction.options.getString("password") as string;

  const user = await User.findOne({ email });

  if (!user) {
    const embed = new EmbedBuilder()
      .setTitle("Account Not Found")
      .setDescription("Unable to locate your Eon account. Please try again.")
      .setColor("#FF0000")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  }

  if (password.length < 8) {
    const embed = new EmbedBuilder()
      .setTitle("Failed to Change Password")
      .setDescription(
        "Your account password must be at least 8 characters long."
      )
      .setColor("#FF0000")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password with the hashed one
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    const embed = new EmbedBuilder()
      .setTitle("Password Changed")
      .setDescription("Successfully changed your account's password.")
      .setColor("#2B2D31")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Error updating password:", error);
    const embed = new EmbedBuilder()
      .setTitle("Password Update Failed")
      .setDescription("An error occurred while updating your password.")
      .setColor("#FF0000")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  }
});
