import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command, getEnv } from "../../utils/index";
import User from "../../models/User";
import bcrypt from "bcrypt";
import { v4 as generateUUID } from "uuid";
import Account from "../../models/Account";
import jwt from "jsonwebtoken";

export const registeredUsers = new Set();
const registrationAttempts = new Map();

const MAX_REGISTRATION_ATTEMPTS = 3;
const REGISTRATION_COOLDOWN_MS = 600000;

const CHANNEL_ID = getEnv("CHANNEL_ID");

const meta = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Register an account for eon.")
  .addStringOption((option) =>
    option
      .setName("email")
      .setDescription("The username you want to use for your eon account.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("The username you want to use for your eon account.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("password")
      .setDescription("The password you want to use for your eon account.")
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  await interaction.deferReply({ ephemeral: true });

  const email = interaction.options.getString("email");
  const username = interaction.options.getString("username");
  const password = interaction.options.getString("password");
  const userId = interaction.user.id;

  if (registeredUsers.has(userId)) {
    const embed = new EmbedBuilder()
      .setTitle("Already Registered")
      .setDescription("You have already registered an account.")
      .setColor("#F01414")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png?",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  }

  const registrationAttempt = registrationAttempts.get(userId) || {
    count: 0,
    timestamp: 0,
  };

  if (registrationAttempt.count >= MAX_REGISTRATION_ATTEMPTS) {
    const embed = new EmbedBuilder()
      .setTitle("Registration Blocked")
      .setDescription(
        "You have exceeded the maximum registration attempts. Please try again later."
      )
      .setColor("#F01414")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  }

  if (interaction.channelId !== CHANNEL_ID) {
    const embed = new EmbedBuilder()
      .setTitle("Command Not Allowed")
      .setDescription(`You can only use this command in <#${CHANNEL_ID}>`)
      .setColor("#F01414")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png?",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    const embed = new EmbedBuilder()
      .setTitle("Registration Failed")
      .setDescription("The provided email or username is already in use.")
      .setColor("#F01414")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
  }

  const saltRounds: number = 10;
  const hashedPassword = await bcrypt.hashSync(password as string, saltRounds);
  const accountId = generateUUID();
  const jwtSecret = Buffer.from(
    "Rd9$2LpFtH7sQnYxGcV5ZjX8KwN1aP0oMvW6eD4uK",
    "utf-8"
  );

  let token = jwt.sign(
    {
      accountId,
      email,
      username,
      id: generateUUID(),
    },
    jwtSecret.toString("base64")
  );

  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    accountId,
    banned: false,
    timesinceLastUpdate: Date.now(),
    accountToken: token,
  });

  try {
    await newUser.save().then(async (account) => {
      console.log(`[Account]: Created user with the username ${username}`);

      const acc = new Account({
        accountId: account.accountId,
        level: 1,
        vbucks: 2000,
      });

      acc.save();
      console.log(`[Account]: Created account with the username ${username}`);
    });

    registeredUsers.add(userId);
    registrationAttempts.delete(userId);

    const embed = new EmbedBuilder()
      .setTitle("Eon Account Created")
      .setDescription("Your account has been successfully created")
      .addFields(
        {
          name: "Username",
          value: username!,
          inline: false,
        },
        {
          name: "Email",
          value: email!,
          inline: false,
        }
      )
      .setColor("#F01414")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    const publiclyViewableEmbed = new EmbedBuilder()
      .setTitle(`New Account Registration`)
      .setDescription(`${interaction.user.username} has registered an account.`)
      .addFields({
        name: "Username",
        value: username!,
      })
      .setColor("#F01414")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    await interaction.channel?.send({ embeds: [publiclyViewableEmbed] });
  } catch (error) {
    console.error("Error registering user:", error);

    const currentTimestamp = Date.now();
    registrationAttempts.set(userId, {
      count: registrationAttempt.count + 1,
      timestamp: currentTimestamp,
    });

    const embed = new EmbedBuilder()
      .setTitle("Account Registration Failed")
      .setDescription("Failed to register account, please try again later!")
      .setColor("#F01414")
      .setFooter({
        text: "Eon",
        iconURL:
          "https://media.discordapp.net/attachments/1158094239129948251/1158172330946723870/c4892206752bd84187c2be4903a6e761.png",
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
});
