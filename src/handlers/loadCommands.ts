import fs from "fs";
import path from "path";
import { BotClient } from "../client";
import { Command } from "../types/command";

export function loadCommands(client: BotClient): Command[] {
  const commandsPath = path.join(__dirname, "..", "commands");
  const files = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  const commands: Command[] = [];

  for (const file of files) {
    const filePath = path.join(commandsPath, file);
    const imported = require(filePath);
    const command: Command = imported.default ?? imported;

    if (!command?.data || !command?.execute) {
      console.warn(`[comandos] ${file} no exporta un comando valido, se omite.`);
      continue;
    }

    client.commands.set(command.data.name, command);
    commands.push(command);
  }

  return commands;
}
