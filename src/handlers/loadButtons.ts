import fs from "fs";
import path from "path";
import { BotClient } from "../client";
import { ButtonHandler } from "../types/button";

export function loadButtons(client: BotClient): void {
  const buttonsPath = path.join(__dirname, "..", "buttons");

  if (!fs.existsSync(buttonsPath)) return;

  const files = fs
    .readdirSync(buttonsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(buttonsPath, file);
    const imported = require(filePath);
    const button: ButtonHandler = imported.default ?? imported;

    if (!button?.customId || !button?.execute) {
      console.warn(`[botones] ${file} no exporta un boton valido, se omite.`);
      continue;
    }

    client.buttons.set(button.customId, button);
  }
}
