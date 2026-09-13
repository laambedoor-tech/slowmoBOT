import { GuildMember, TextChannel } from "discord.js";
import { TICKET_BRAND, TICKET_CLOSE_DELETE_DELAY_MS } from "./config";
import { getTicketByChannel, removeTicket, updateTicket } from "./store";
import { isStaff } from "./permissions";
import { buildTranscript } from "./transcript";
import { buildFeedbackRatingRow, buildFeedbackRequestEmbed } from "./embeds";
import { TicketRecord } from "./types";

export type CloseCheckResult =
  | { ok: true; ticket: TicketRecord }
  | { ok: false; reason: string };

export function checkCanClose(channelId: string, userId: string, member: GuildMember | null): CloseCheckResult {
  const ticket = getTicketByChannel(channelId);
  if (!ticket) return { ok: false, reason: "This channel is not an active ticket." };
  if (ticket.status === "closed") return { ok: false, reason: "This ticket is already closed." };
  if (ticket.userId !== userId && !(member && isStaff(member))) {
    return { ok: false, reason: "You don't have permission to close this ticket." };
  }
  return { ok: true, ticket };
}

export async function performClose(channel: TextChannel, ticket: TicketRecord, closedByUserId: string): Promise<void> {
  updateTicket(ticket.channelId, { status: "closed", closedAt: Date.now(), closedBy: closedByUserId });

  await channel.permissionOverwrites.edit(ticket.userId, { SendMessages: false }).catch(() => null);

  const transcript = await buildTranscript(channel).catch(() => null);
  const owner = await channel.client.users.fetch(ticket.userId).catch(() => null);

  if (owner) {
    try {
      const dm = await owner.createDM();
      await dm.send({
        content: `Your ticket in **${TICKET_BRAND.name}** has been closed. Here is a transcript of your conversation.`,
        files: transcript ? [transcript] : [],
      });
      await dm.send({
        embeds: [buildFeedbackRequestEmbed()],
        components: [buildFeedbackRatingRow(ticket.channelId)],
      });
    } catch {
      await channel
        .send("⚠️ Could not send the transcript/feedback request by DM (the user may have DMs disabled).")
        .catch(() => null);
    }
  }

  await channel
    .send(
      `🔒 Ticket closed by <@${closedByUserId}>. This channel will be deleted in ${Math.round(
        TICKET_CLOSE_DELETE_DELAY_MS / 1000
      )} seconds.`
    )
    .catch(() => null);

  setTimeout(() => {
    removeTicket(ticket.channelId);
    channel.delete().catch(() => null);
  }, TICKET_CLOSE_DELETE_DELAY_MS);
}
