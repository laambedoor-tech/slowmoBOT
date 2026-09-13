import fs from "fs";
import path from "path";
import { TicketRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tickets.json");

function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

function readAll(): TicketRecord[] {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as TicketRecord[];
  } catch {
    return [];
  }
}

function writeAll(records: TicketRecord[]): void {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), "utf-8");
}

export function getOpenTicketsForUser(userId: string): TicketRecord[] {
  return readAll().filter((t) => t.userId === userId && t.status === "open");
}

export function getTicketByChannel(channelId: string): TicketRecord | undefined {
  return readAll().find((t) => t.channelId === channelId);
}

export function addTicket(record: TicketRecord): void {
  const records = readAll();
  records.push(record);
  writeAll(records);
}

export function updateTicket(channelId: string, changes: Partial<TicketRecord>): void {
  const records = readAll();
  const index = records.findIndex((t) => t.channelId === channelId);
  if (index === -1) return;
  records[index] = { ...records[index], ...changes };
  writeAll(records);
}

export function removeTicket(channelId: string): void {
  const records = readAll().filter((t) => t.channelId !== channelId);
  writeAll(records);
}
