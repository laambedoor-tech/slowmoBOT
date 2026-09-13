import { StringSelectMenuInteraction } from "discord.js";

export interface SelectMenuHandler {
  customId: string;
  execute: (interaction: StringSelectMenuInteraction) => Promise<void>;
}
