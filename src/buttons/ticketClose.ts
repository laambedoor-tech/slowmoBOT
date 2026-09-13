import { ButtonInteraction, GuildMember } from "discord.js";
import { ButtonHandler } from "../types/button";
import { checkCanClose } from "../tickets/closeFlow";
import { buildCloseConfirmRow } from "../tickets/embeds";

const handler: ButtonHandler = {
  customId: "ticket_close",

  async execute(interaction: ButtonInteraction) {
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

export default handler;
