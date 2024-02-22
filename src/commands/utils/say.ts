import { EmbedBuilder } from "discord.js";
import { CommandObject, CommandUsage } from "../../typings";

export default {
   description: "Make the bot say something",

   type: "LEGACY",
   ownerOnly: true,

   minArgs: 1,

   // Invoked when a user runs the command
   callback: ({ message, args }: CommandUsage) => {
      message?.delete();

      const embed = new EmbedBuilder()
         .setColor("Gold")
         .setDescription(args.join(""));

      message?.channel.send({
         embeds: [embed],
      });
   },
} as CommandObject;
