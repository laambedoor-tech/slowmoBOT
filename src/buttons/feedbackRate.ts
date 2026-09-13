import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonHandler } from "../types/button";

const handler: ButtonHandler = {
  customId: "feedback_rate_",

  async execute(interaction: ButtonInteraction) {
    const match = interaction.customId.match(/^feedback_rate_(\d)_(\d+)$/);
    if (!match) {
      await interaction.reply({ content: "Something went wrong with this feedback prompt.", ephemeral: true });
      return;
    }

    const [, rating, ticketChannelId] = match;

    const modal = new ModalBuilder()
      .setCustomId(`feedback_comment_modal_${rating}_${ticketChannelId}`)
      .setTitle("Leave additional feedback")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("comment")
            .setLabel("Additional comments (optional)")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setPlaceholder("Tell us more about your experience...")
            .setMaxLength(1000)
        )
      );

    await interaction.showModal(modal);
  },
};

export default handler;
