import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "../types/command";
import { buildCategorySelectMenu, buildLogoAttachment, buildPanelEmbed } from "../tickets/embeds";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("panel-tickets")
    .setDescription("Post the ticket support panel in this channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) {
      await interaction.reply({ content: "This command can only be used in a text channel.", ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    await interaction.channel.send({
      embeds: [buildPanelEmbed()],
      components: [buildCategorySelectMenu()],
      files: [buildLogoAttachment()],
    });

    await interaction.editReply("Ticket panel posted.");
  },
};

export default command;
