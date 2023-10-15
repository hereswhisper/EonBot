import {
  APIEmbedField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import CategoryRoot from "../commands";
import { chunk, createId, readId } from "../utils";

export const Namespaces = {
  root: "help_category_root",
  select: "help_category_select",
  action: "help_category_action",
};

export const Actions = {
  next: "+",
  back: "-",
};

export function getCategoryRoot(ephemeral?: boolean): InteractionReplyOptions {
  const mappedCategories = CategoryRoot.map(
    ({ name, description, emoji }) =>
      new StringSelectMenuOptionBuilder({
        label: name,
        description,
        emoji,
        value: name,
      })
  );

  const embed = new EmbedBuilder()
    .setTitle("Help Menu")
    .setDescription("Browse through all of the bots commands.");

  const selectId = createId(Namespaces.select);
  const select = new StringSelectMenuBuilder()
    .setCustomId(selectId)
    .setPlaceholder("Command Category")
    .setMaxValues(1)
    .setOptions(mappedCategories);

  const component =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  return {
    embeds: [embed],
    components: [component],
    ephemeral,
  };
}

export function getCategoryPage(
  interactionId: string
): InteractionReplyOptions {
  const [_namespace, categoryName, action, currentOffset] =
    readId(interactionId);

  const categoryChunks = CategoryRoot.map((c) => {
    const commands: APIEmbedField[] = c.commands.map((c) => ({
      name: c.meta.name,
      value: c.meta.description,
    }));

    return {
      ...c,
      commands: chunk(commands, 10),
    };
  });

  const category = categoryChunks.find(({ name }) => name === categoryName);
  if (!category)
    throw new Error(
      "[Error] Invalid interactionId; Failed to find corresponding category page."
    );

  let offset = parseInt(currentOffset);
  if (isNaN(offset)) offset = 0;

  if (action === Actions.next) offset++;
  else if (action === Actions.back) offset--;

  const emoji = category.emoji ? `${category.emoji} ` : "";
  const defaultDescription = `Browse through ${
    category.commands.flat().length
  } commands in ${emoji}${category.name}`;

  const embed = new EmbedBuilder()
    .setTitle(`${emoji}${category.name} Commands`)
    .setDescription(category.description ?? defaultDescription)
    .setFields(category.commands[offset])
    .setFooter({ text: `${offset + 1} / ${category.commands.length}` });

  // Back Button
  const backId = createId(
    Namespaces.action,
    category.name,
    Actions.back,
    offset
  );
  const backButton = new ButtonBuilder()
    .setCustomId(backId)
    .setLabel("Back")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(offset <= 0);

  // Return to root button
  const rootId = createId(Namespaces.root);
  const rootButton = new ButtonBuilder()
    .setCustomId(rootId)
    .setLabel("Categories")
    .setStyle(ButtonStyle.Secondary);

  // Next Button
  const nextId = createId(
    Namespaces.action,
    category.name,
    Actions.next,
    offset
  );
  const nextButton = new ButtonBuilder()
    .setCustomId(nextId)
    .setLabel("Next")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(offset >= category.commands.length - 1);

  const component = new ActionRowBuilder<ButtonBuilder>().addComponents(
    backButton,
    rootButton,
    nextButton
  );

  return {
    embeds: [embed],
    components: [component],
  };
}
