import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  User,
} from "discord.js";
import { TICKET_BRAND } from "../tickets/config";

const logoUrl = `attachment://${TICKET_BRAND.logoAttachmentName}`;

export function buildSuggestionsPanelEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(TICKET_BRAND.color)
    .setAuthor({ name: `${TICKET_BRAND.name} Suggestions`, iconURL: logoUrl })
    .setTitle("💡 Suggestions")
    .setDescription(
      `Have an idea to improve ${TICKET_BRAND.name}? We'd love to hear it.\nClick the button below to submit a suggestion.`
    )
    .setFooter({ text: TICKET_BRAND.footer, iconURL: logoUrl })
    .setTimestamp();
}

export function buildSuggestionsPanelRow(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("suggestion_open_modal")
      .setLabel("Submit Suggestion")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Primary)
  );
}

export function buildSuggestionModal(): ModalBuilder {
  return new ModalBuilder()
    .setCustomId("suggestion_modal")
    .setTitle("Submit a Suggestion")
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("title")
          .setLabel("Title")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100)
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Describe your suggestion")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000)
      )
    );
}

export function buildSuggestionPostedEmbed(title: string, description: string, user: User): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(TICKET_BRAND.color)
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: `Suggested by ${user.tag}` })
    .setTimestamp();
}
