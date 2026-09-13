import { createClient } from "./client";
import { config } from "./config";
import { loadCommands } from "./handlers/loadCommands";
import { loadButtons } from "./handlers/loadButtons";
import { registerReadyEvent } from "./events/ready";
import { registerInteractionCreateEvent } from "./events/interactionCreate";

const client = createClient();

loadCommands(client);
loadButtons(client);

registerReadyEvent(client);
registerInteractionCreateEvent(client);

client.login(config.token);
