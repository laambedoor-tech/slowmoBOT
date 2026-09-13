import { ModalSubmitInteraction, TextChannel } from "discord.js";
import { ModalHandler } from "../types/modal";
import { SUGGESTIONS_LOG_CHANNEL_ID } from "../suggestions/config";
import { buildSuggestionPostedEmbed } from "../suggestions/embeds";

const handler: ModalHandler = {
  customId: "suggestion_modal",

  async execute(interaction: ModalSubmitInteraction) {
    const title = interaction.fields.getTextInputValue("title").trim();
    const description = interaction.fields.getTextInputValue("description").trim();

    if (!SUGGESTIONS_LOG_CHANNEL_ID) {
      await interaction.reply({ content: "Suggestions are not configured yet. Please contact an admin.", ephemeral: true });
      return;
    }

    const logChannel = await interaction.client.channels.fetch(SUGGESTIONS_LOG_CHANNEL_ID).catch(() => null);
    if (!(logChannel instanceof TextChannel)) {
      await interaction.reply({ content: "Could not find the suggestions channel. Please contact an admin.", ephemeral: true });
      return;
    }

    const message = await logChannel.send({ embeds: [buildSuggestionPostedEmbed(title, description, interaction.user)] });
    await message.react("👍").catch(() => null);
    await message.react("👎").catch(() => null);

    await interaction.reply({ content: "Thanks! Your suggestion has been submitted.", ephemeral: true });
  },
};

export default handler;
