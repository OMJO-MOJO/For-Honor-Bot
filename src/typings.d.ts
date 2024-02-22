import { Client } from "discord.js";
import ProfileManager from "./Managers/ProfileManager";

export class ForHonorBot extends Client {
   profiles: ProfileManager;
}

export interface CommandUsage {
   client: ForHonorBot;
   instance: WOK;
   message?: Message | null;
   interaction?: ChatInputCommandInteraction | ButtonInteraction;
   args: string[];
   text: string;
   guild?: Guild | null;
   member?: GuildMember;
   user: User;
   channel?: TextChannel;
   emojis?: Collection<string, GuildEmoji> | null;
   cancelCooldown?: function;
   updateCooldown?: function;
   update?: boolean;
}

export interface CommandObject {
   callback: (commandUsage: CommandUsage) => unknown;
   type: CommandType;
   init?: function;
   description?: string;
   category?: string | "misc";
   aliases?: string[];
   testOnly?: boolean;
   guildOnly?: boolean;
   ownerOnly?: boolean;
   permissions?: bigint[];
   deferReply?: "ephemeral" | boolean;
   cooldowns?: CooldownUsage;
   minArgs?: number;
   maxArgs?: number;
   correctSyntax?: string;
   expectedArgs?: string;
   options?: ApplicationCommandOption[];
   autocomplete?: function;
   reply?: boolean;
   delete?: boolean;
}

export type UserId = string;

export interface Profile {
   _id: string; // user ID
   faction?: string;
   heros?: string[];
   rank?: number;
}
