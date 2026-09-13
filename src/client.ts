import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "./types/command";
import { ButtonHandler } from "./types/button";

export class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public buttons: Collection<string, ButtonHandler> = new Collection();
}

export function createClient(): BotClient {
  return new BotClient({
    intents: [GatewayIntentBits.Guilds],
  });
}
