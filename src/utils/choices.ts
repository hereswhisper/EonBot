import { APIApplicationCommandOptionChoice } from "discord.js";

export const statusChoices: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "Offline",
    value: "offline",
  },
  {
    name: "Away",
    value: "away",
  },
  {
    name: "DND",
    value: "dnd",
  },
  {
    name: "Stream",
    value: "stream",
  },
  {
    name: "Available",
    value: "available",
  },
];

export const presenceChoices: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "QueueId",
    value: "queueId",
  },
  {
    name: "Rank",
    value: "rank",
  },
  {
    name: "AccountLevel",
    value: "level",
  },
  {
    name: "PlayerTitleId",
    value: "playerTitleId",
  },
  {
    name: "LeaderboardPosition",
    value: "leaderboardPosition"
  },
  {
    name: "PartyOwnerMatchScoreAllyTeam",
    value: "partyOwnerMatchScoreAllyTeam"
  },
  {
    name: "PartyOwnerMatchScoreEnemyTeam",
    value: "partyOwnerMatchScoreEnemyTeam"
  },
  {
    name: "PlayerCardId",
    value: "playerCardId"
  }
];
