import { ButtonInteraction, GuildMember, TextChannel } from "discord.js";
import { ButtonHandler } from "../types/button";
import { checkCanClose, performClose } from "../tickets/closeFlow";

const handler: ButtonHandler = {
  customId: "ticket_close_confirm",

  async execute(interaction: ButtonInteraction) {
    const member = interaction.member as GuildMember | null;
    const check = checkCanClose(interaction.channelId, interaction.user.id, member);

    if (!check.ok) {
      await interaction.update({ content: check.reason, components: [] });
      return;
    }

    await interaction.update({ content: "Closing ticket...", components: [] });
    await performClose(interaction.channel as TextChannel, check.ticket, interaction.user.id);
  },
};

export default handler;
