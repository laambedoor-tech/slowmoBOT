import { ChannelType, Guild } from "discord.js";
import { TICKET_CATEGORY_CHANNEL_ID } from "./config";

const DEFAULT_CATEGORY_NAME = "🎫 Tickets";

export async function ensureTicketCategoryId(guild: Guild): Promise<string> {
  if (TICKET_CATEGORY_CHANNEL_ID) {
    const existing = await guild.channels.fetch(TICKET_CATEGORY_CHANNEL_ID).catch(() => null);
    if (existing && existing.type === ChannelType.GuildCategory) {
      return existing.id;
    }
  }

  const channels = await guild.channels.fetch();
  const byName = channels.find(
    (channel) => channel?.type === ChannelType.GuildCategory && channel.name === DEFAULT_CATEGORY_NAME
  );
  if (byName) return byName.id;

  const created = await guild.channels.create({
    name: DEFAULT_CATEGORY_NAME,
    type: ChannelType.GuildCategory,
  });
  return created.id;
}
