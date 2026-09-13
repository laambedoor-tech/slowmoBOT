import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "../types/command";
import { buildLogoAttachment } from "../tickets/embeds";
import { buildSuggestionsPanelEmbed, buildSuggestionsPanelRow } from "../suggestions/embeds";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("panel-suggestions")
    .setDescription("Post the suggestions panel in this channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) {
      await interaction.reply({ content: "This command can only be used in a text channel.", ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    await interaction.channel.send({
      embeds: [buildSuggestionsPanelEmbed()],
      components: [buildSuggestionsPanelRow()],
      files: [buildLogoAttachment()],
    });

    await interaction.editReply("Suggestions panel posted.");
  },
};

export default command;
