import { ButtonInteraction } from "discord.js";
import { ButtonHandler } from "../types/button";

const handler: ButtonHandler = {
  customId: "ticket_close_cancel",

  async execute(interaction: ButtonInteraction) {
    await interaction.update({ content: "Ticket close cancelled.", components: [] });
  },
};

export default handler;
