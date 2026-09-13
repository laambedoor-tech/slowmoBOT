import { ChannelType, PermissionFlagsBits, StringSelectMenuInteraction } from "discord.js";
import { SelectMenuHandler } from "../types/select";
import { getCategoryById, MAX_OPEN_TICKETS_PER_USER, STAFF_ROLE_IDS } from "../tickets/config";
import { addTicket, getOpenTicketsForUser } from "../tickets/store";
import { buildLogoAttachment, buildOpenTicketRow, buildTicketChannelEmbed } from "../tickets/embeds";
import { ensureTicketCategoryId } from "../tickets/ticketCategoryChannel";

function sanitizeForChannelName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 25) || "user";
}

const handler: SelectMenuHandler = {
  customId: "ticket_category_select",

  async execute(interaction: StringSelectMenuInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "This can only be used inside a server.", ephemeral: true });
      return;
    }

    const category = getCategoryById(interaction.values[0]);
    if (!category) {
      await interaction.reply({ content: "Unknown ticket category.", ephemeral: true });
      return;
    }

    const openTickets = getOpenTicketsForUser(interaction.user.id);
    if (openTickets.length >= MAX_OPEN_TICKETS_PER_USER) {
      await interaction.reply({
        content: `You already have an open ticket: <#${openTickets[0].channelId}>`,
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const parentId = await ensureTicketCategoryId(interaction.guild);
    const botId = interaction.client.user!.id;

    const channel = await interaction.guild.channels.create({
      name: `${category.shortCode}-${sanitizeForChannelName(interaction.user.username)}`,
      type: ChannelType.GuildText,
      parent: parentId,
      topic: `Ticket opened by ${interaction.user.tag} (${interaction.user.id}) - ${category.label}`,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AttachFiles,
          ],
        },
        {
          id: botId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.ManageChannels,
          ],
        },
        ...STAFF_ROLE_IDS.map((roleId) => ({
          id: roleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AttachFiles,
          ],
        })),
      ],
    });

    addTicket({
      channelId: channel.id,
      userId: interaction.user.id,
      categoryId: category.id,
      status: "open",
      createdAt: Date.now(),
    });

    const staffMentions = STAFF_ROLE_IDS.map((roleId) => `<@&${roleId}>`).join(" ");

    await channel.send({
      content: `<@${interaction.user.id}> ${staffMentions}`.trim(),
      embeds: [buildTicketChannelEmbed(category, interaction.user)],
      components: [buildOpenTicketRow()],
      files: [buildLogoAttachment()],
      allowedMentions: { users: [interaction.user.id], roles: STAFF_ROLE_IDS },
    });

    await interaction.editReply(`✅ Your ticket has been created: <#${channel.id}>`);
  },
};

export default handler;
