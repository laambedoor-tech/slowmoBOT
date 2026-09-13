import { AttachmentBuilder, Message, TextChannel } from "discord.js";

export async function buildTranscript(channel: TextChannel): Promise<AttachmentBuilder> {
  const messages: Message[] = [];
  let beforeId: string | undefined;

  for (let i = 0; i < 20; i++) {
    const batch = await channel.messages.fetch({ limit: 100, before: beforeId });
    if (batch.size === 0) break;
    messages.push(...batch.values());
    beforeId = batch.last()?.id;
    if (batch.size < 100) break;
  }

  messages.reverse();

  const lines = messages.map((message) => {
    const timestamp = new Date(message.createdTimestamp).toISOString();
    const content = message.content || (message.attachments.size > 0 ? "[attachment]" : "[no content]");
    return `[${timestamp}] ${message.author.tag}: ${content}`;
  });

  const body = lines.length > 0 ? lines.join("\n") : "No messages were sent in this ticket.";
  return new AttachmentBuilder(Buffer.from(body, "utf-8"), { name: `transcript-${channel.name}.txt` });
}
