import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  User,
} from "discord.js";
import path from "path";
import { TICKET_BRAND, TICKET_CATEGORIES } from "./config";
import { TicketCategoryConfig } from "./types";

const logoUrl = `attachment://${TICKET_BRAND.logoAttachmentName}`;

export function buildLogoAttachment(): AttachmentBuilder {
  const logoPath = path.join(process.cwd(), "assets", "logo.png");
  return new AttachmentBuilder(logoPath, { name: TICKET_BRAND.logoAttachmentName });
}

export function buildPanelEmbed(): EmbedBuilder {
  const categoryList = TICKET_CATEGORIES.map(
    (category) => `${category.emoji} **${category.label}** — ${category.description}`
  ).join("\n");

  return new EmbedBuilder()
    .setColor(TICKET_BRAND.color)
    .setAuthor({ name: `${TICKET_BRAND.name} Support`, iconURL: logoUrl })
    .setTitle("Support Center")
    .setDescription(
      `Welcome to ${TICKET_BRAND.name} Support.\n` +
        "Choose the department that best matches your request so the correct team can review it quickly.\n\n" +
        `${categoryList}\n\n` +
        "Please keep your order details ready before opening a ticket.\n" +
        "Open the menu below and select the category that fits your situation."
    )
    .setThumbnail(logoUrl)
    .setFooter({ text: TICKET_BRAND.footer, iconURL: logoUrl })
    .setTimestamp();
}

export function buildCategorySelectMenu(): ActionRowBuilder<StringSelectMenuBuilder> {
  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_category_select")
    .setPlaceholder("Select a ticket category...")
    .addOptions(
      TICKET_CATEGORIES.map((category) => ({
        label: category.label,
        description: category.description.slice(0, 100),
        value: category.id,
        emoji: category.emoji,
      }))
    );

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}

export function buildTicketChannelEmbed(category: TicketCategoryConfig, user: User): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(TICKET_BRAND.color)
    .setAuthor({ name: `${category.label} Ticket`, iconURL: logoUrl })
    .setDescription(
      `Hello <@${user.id}>! Thank you for contacting **${TICKET_BRAND.name}**.\n\n` +
        `**Category:** ${category.label}\n` +
        `**Description:** ${category.description}\n\n` +
        "A member of the support team will assist you soon. Meanwhile, you can provide more details about your inquiry.\n\n" +
        `**What information should you include?**\n${category.details}\n\n` +
        "*Response time may vary. Please be patient.*"
    )
    .addFields(
      { name: "🟢 Ticket Status", value: "Open", inline: true },
      { name: "👤 User", value: `<@${user.id}>`, inline: true },
      { name: "📅 Creation Date", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
    )
    .setFooter({ text: TICKET_BRAND.footer, iconURL: logoUrl })
    .setTimestamp();
}

export function buildOpenTicketRow(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("Close Ticket")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Danger)
  );
}

export function buildCloseConfirmRow(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("ticket_close_confirm").setLabel("Confirm Close").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("ticket_close_cancel").setLabel("Cancel").setStyle(ButtonStyle.Secondary)
  );
}

export function buildFeedbackRequestEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(TICKET_BRAND.color)
    .setTitle("How did we do?")
    .setDescription(
      `Your ticket in **${TICKET_BRAND.name}** has been closed.\nPlease rate the support you received by clicking a star below.`
    )
    .setFooter({ text: TICKET_BRAND.footer, iconURL: logoUrl })
    .setTimestamp();
}

export function buildFeedbackRatingRow(ticketChannelId: string): ActionRowBuilder<ButtonBuilder> {
  const buttons = [1, 2, 3, 4, 5].map((rating) =>
    new ButtonBuilder()
      .setCustomId(`feedback_rate_${rating}_${ticketChannelId}`)
      .setLabel(`${rating}⭐`)
      .setStyle(ButtonStyle.Secondary)
  );
  return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
}
