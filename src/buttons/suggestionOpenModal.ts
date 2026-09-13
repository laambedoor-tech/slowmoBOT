import { ButtonInteraction } from "discord.js";
import { ButtonHandler } from "../types/button";
import { buildSuggestionModal } from "../suggestions/embeds";

const handler: ButtonHandler = {
  customId: "suggestion_open_modal",

  async execute(interaction: ButtonInteraction) {
    await interaction.showModal(buildSuggestionModal());
  },
};

export default handler;
