import "dotenv/config";

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name} (revisa tu archivo .env)`);
  }
  return value;
}

export const config = {
  token: required("DISCORD_TOKEN", process.env.DISCORD_TOKEN),
  clientId: required("CLIENT_ID", process.env.CLIENT_ID),
  guildId: process.env.GUILD_ID || undefined,
};
