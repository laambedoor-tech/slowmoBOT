import { Events } from "discord.js";
import { BotClient } from "../client";

export function registerReadyEvent(client: BotClient) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Conectado como ${readyClient.user.tag}`);
  });
}
