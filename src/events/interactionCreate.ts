import { Events, Interaction } from "discord.js";
import { BotClient } from "../client";

export function registerInteractionCreateEvent(client: BotClient) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error ejecutando el comando ${interaction.commandName}:`, error);
        const payload = { content: "Hubo un error al ejecutar este comando.", ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(payload);
        } else {
          await interaction.reply(payload);
        }
      }
      return;
    }

    if (interaction.isButton()) {
      // Router: primero busca match exacto, luego por prefijo (ej: "ticket_close_123")
      const exact = client.buttons.get(interaction.customId);
      const handler =
        exact ??
        [...client.buttons.values()].find((b) => interaction.customId.startsWith(b.customId));

      if (!handler) return;

      try {
        await handler.execute(interaction);
      } catch (error) {
        console.error(`Error ejecutando el boton ${interaction.customId}:`, error);
        const payload = { content: "Hubo un error al procesar esta accion.", ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(payload);
        } else {
          await interaction.reply(payload);
        }
      }
    }
  });
}
