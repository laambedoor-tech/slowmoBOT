import { Events, GuildMember } from "discord.js";
import { BotClient } from "../client";

const AUTO_ROLE_ID = "1547729299715661847";

export function registerGuildMemberAddEvent(client: BotClient) {
  client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    try {
      await member.roles.add(AUTO_ROLE_ID);
    } catch (error) {
      console.error(`No se pudo asignar el rol automatico a ${member.user.tag}:`, error);
    }
  });
}
