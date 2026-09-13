import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { config } from "./config";
import { Command } from "./types/command";

async function main() {
  const commandsPath = path.join(__dirname, "commands");
  const files = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  const body = files.map((file) => {
    const imported = require(path.join(commandsPath, file));
    const command: Command = imported.default ?? imported;
    return command.data.toJSON();
  });

  const rest = new REST().setToken(config.token);

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body });
    console.log(`Comandos registrados en el servidor ${config.guildId} (${body.length}).`);
  } else {
    await rest.put(Routes.applicationCommands(config.clientId), { body });
    console.log(`Comandos registrados globalmente (${body.length}). Puede tardar hasta 1 hora en propagarse.`);
  }
}

main().catch((error) => {
  console.error("Error registrando comandos:", error);
  process.exit(1);
});
