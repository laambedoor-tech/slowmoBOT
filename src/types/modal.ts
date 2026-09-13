import { ModalSubmitInteraction } from "discord.js";

export interface ModalHandler {
  customId: string;
  execute: (interaction: ModalSubmitInteraction) => Promise<void>;
}
