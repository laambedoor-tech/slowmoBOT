export interface TicketCategoryConfig {
  id: string;
  shortCode: string;
  label: string;
  emoji: string;
  description: string;
  details: string;
}

export type TicketStatus = "open" | "closed";

export interface TicketRecord {
  channelId: string;
  userId: string;
  categoryId: string;
  status: TicketStatus;
  createdAt: number;
  closedAt?: number;
  closedBy?: string;
}
