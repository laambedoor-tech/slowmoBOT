import fs from "fs";
import path from "path";
import { BotClient } from "../client";
import { ModalHandler } from "../types/modal";

export function loadModals(client: BotClient): void {
  const modalsPath = path.join(__dirname, "..", "modals");

  if (!fs.existsSync(modalsPath)) return;

  const files = fs
    .readdirSync(modalsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(modalsPath, file);
    const imported = require(filePath);
    const modal: ModalHandler = imported.default ?? imported;

    if (!modal?.customId || !modal?.execute) {
      console.warn(`[modals] ${file} no exporta un modal valido, se omite.`);
      continue;
    }

    client.modals.set(modal.customId, modal);
  }
}
