import { GuildMember, PermissionFlagsBits } from "discord.js";
import { STAFF_ROLE_IDS } from "./config";

export function isStaff(member: GuildMember): boolean {
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  return STAFF_ROLE_IDS.some((roleId) => member.roles.cache.has(roleId));
}
