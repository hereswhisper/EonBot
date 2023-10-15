import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ModalSubmitInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { LogMethod } from "./index";

export interface CommandProps {
  interaction: ChatInputCommandInteraction;
  client: Client;
  log: LogMethod;
}

export interface ModalProps {
  interaction: ModalSubmitInteraction;
  client: Client;
  log: LogMethod;
}

export type CommandCallback = (props: CommandProps) => Awaitable<unknown>;
export type CommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export type ModalMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export type ModalCallback = (props: ModalProps) => Awaitable<unknown>;

export interface Command {
  meta: CommandMeta;
  callback: CommandCallback;
}

export interface Modal {
  meta: ModalMeta;
  callback: ModalCallback;
}

export interface CommandCategoryExtra {
  description?: string;
  emoji?: string;
}

export interface CommandCategory extends CommandCategoryExtra {
  name: string;
  commands: Command[];
}

export function command(meta: CommandMeta, callback: CommandCallback): Command {
  return { meta, callback };
}

export function modal(meta: ModalMeta, callback: ModalCallback): Modal {
  return { meta, callback };
}

export function category(
  name: string,
  commands: Command[],
  extra: CommandCategoryExtra = {}
): CommandCategory {
  return {
    name,
    commands,
    ...extra,
  };
}
