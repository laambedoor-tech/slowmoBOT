import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";
import { checkCanClose } from "../tickets/closeFlow";
import { buildCloseConfirmRow } from "../tickets/embeds";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("close-ticket")
    .setDescription("Close the current ticket channel"),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember | null;
    const check = checkCanClose(interaction.channelId, interaction.user.id, member);

    if (!check.ok) {
      await interaction.reply({ content: check.reason, ephemeral: true });
      return;
    }

    await interaction.reply({
      content: "Are you sure you want to close this ticket? This cannot be undone.",
      components: [buildCloseConfirmRow()],
      ephemeral: true,
    });
  },
};

export default command;
