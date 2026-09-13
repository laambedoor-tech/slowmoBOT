import { EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import { ModalHandler } from "../types/modal";
import { FEEDBACK_CHANNEL_ID, TICKET_BRAND } from "../tickets/config";

const handler: ModalHandler = {
  customId: "feedback_comment_modal_",

  async execute(interaction: ModalSubmitInteraction) {
    const match = interaction.customId.match(/^feedback_comment_modal_(\d)_(\d+)$/);
    if (!match) {
      await interaction.reply({ content: "Something went wrong with this feedback form.", ephemeral: true });
      return;
    }

    const [, ratingStr, ticketChannelId] = match;
    const rating = Number(ratingStr);
    const comment = interaction.fields.getTextInputValue("comment").trim() || "No additional comments provided.";
    const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);

    const embed = new EmbedBuilder()
      .setColor(TICKET_BRAND.color)
      .setTitle("New Support Feedback")
      .addFields(
        { name: "Rating", value: `${stars} (${rating}/5)` },
        { name: "User", value: `<@${interaction.user.id}> (${interaction.user.tag})` },
        { name: "Ticket Channel ID", value: ticketChannelId },
        { name: "Comment", value: comment }
      )
      .setTimestamp();

    if (FEEDBACK_CHANNEL_ID) {
      const feedbackChannel = await interaction.client.channels.fetch(FEEDBACK_CHANNEL_ID).catch(() => null);
      if (feedbackChannel instanceof TextChannel) {
        await feedbackChannel.send({ embeds: [embed] }).catch(() => null);
      }
    }

    await interaction.reply({ content: "Thanks for your feedback!", ephemeral: true });
  },
};

export default handler;
