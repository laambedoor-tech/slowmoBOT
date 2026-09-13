import { ActivityType, Events, Routes } from "discord.js";
import { BotClient } from "../client";

const APP_DESCRIPTION =
  "Official support bot for slowmo.es — open tickets, share feedback and submit suggestions.";

export function registerReadyEvent(client: BotClient) {
  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Conectado como ${readyClient.user.tag}`);

    readyClient.user.setPresence({
      activities: [{ name: "slowmo.es", type: ActivityType.Playing }],
      status: "online",
    });

    try {
      await readyClient.rest.patch(Routes.currentApplication(), {
        body: { description: APP_DESCRIPTION },
      });
    } catch (error) {
      console.error("No se pudo actualizar la descripcion de la aplicacion:", error);
    }
  });
}
