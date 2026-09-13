import fs from "fs";
import path from "path";
import { BotClient } from "../client";
import { SelectMenuHandler } from "../types/select";

export function loadSelectMenus(client: BotClient): void {
  const selectsPath = path.join(__dirname, "..", "selects");

  if (!fs.existsSync(selectsPath)) return;

  const files = fs
    .readdirSync(selectsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(selectsPath, file);
    const imported = require(filePath);
    const select: SelectMenuHandler = imported.default ?? imported;

    if (!select?.customId || !select?.execute) {
      console.warn(`[selects] ${file} no exporta un select menu valido, se omite.`);
      continue;
    }

    client.selectMenus.set(select.customId, select);
  }
}
