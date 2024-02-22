import {
   ApplicationCommandOptionType,
   EmbedBuilder,
   GuildMember,
} from "discord.js";
import { CommandObject, CommandUsage } from "../../typings";

export default {
   description: "View the server's leaderboard",

   type: "BOTH",
   testOnly: true,

   // Invoked when a user runs the command
   callback: async ({
      interaction,
      member,
      guild,
      args,
      client,
   }: CommandUsage) => {
      const leaderboard = await client.profiles.leaderboard();
   },
} as CommandObject;
