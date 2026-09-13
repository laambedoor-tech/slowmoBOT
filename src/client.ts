import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "./types/command";
import { ButtonHandler } from "./types/button";
import { SelectMenuHandler } from "./types/select";
import { ModalHandler } from "./types/modal";

export class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public buttons: Collection<string, ButtonHandler> = new Collection();
  public selectMenus: Collection<string, SelectMenuHandler> = new Collection();
  public modals: Collection<string, ModalHandler> = new Collection();
}

export function createClient(): BotClient {
  return new BotClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  });
}
