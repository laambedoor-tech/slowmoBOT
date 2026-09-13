import "dotenv/config";
import { TicketCategoryConfig } from "./types";

export const TICKET_BRAND = {
  name: "sloWmo",
  footer: "sloWmo Support System",
  color: 0x3b82f6,
  logoAttachmentName: "logo.png",
};

export const TICKET_CATEGORIES: TicketCategoryConfig[] = [
  {
    id: "product_not_received",
    shortCode: "product",
    label: "Product Not Received",
    emoji: "📦",
    description: "Support for products you have not received after purchase.",
    details:
      "Please include:\n• Order / transaction ID\n• Approximate date of purchase\n• Payment method used\n• Payment screenshot (if you have it)",
  },
  {
    id: "replacement",
    shortCode: "replace",
    label: "Replacement",
    emoji: "♻️",
    description: "Request a replacement for a delivered item that is not working.",
    details:
      "Please include:\n• Order / transaction ID\n• What's wrong with the product\n• Screenshots or proof if possible",
  },
  {
    id: "support",
    shortCode: "support",
    label: "General Support",
    emoji: "❓",
    description: "General questions or help from the staff team.",
    details: "Describe your issue or question with as much detail as possible.",
  },
];

const rawStaffRoleIds = process.env.STAFF_ROLE_IDS ?? "";
export const STAFF_ROLE_IDS: string[] = rawStaffRoleIds
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const TICKET_CATEGORY_CHANNEL_ID = process.env.TICKET_CATEGORY_ID || undefined;

export const FEEDBACK_CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID || undefined;

export const MAX_OPEN_TICKETS_PER_USER = 1;

export const TICKET_CLOSE_DELETE_DELAY_MS = 5000;

export function getCategoryById(id: string): TicketCategoryConfig | undefined {
  return TICKET_CATEGORIES.find((category) => category.id === id);
}
