import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types/command";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Comprueba que el bot esta funcionando"),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: "Calculando ping...", fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(
      `Pong! Latencia: ${latency}ms | API: ${Math.round(interaction.client.ws.ping)}ms`
    );
  },
};

export default command;
