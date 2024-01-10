import { EmbedBuilder } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
   description: "Make the bot say something",

   type: CommandType.LEGACY,

   minArgs: 1,

   // Invoked when a user runs the command
   callback: ({ message, args }) => {
      message?.delete();

      const embed = new EmbedBuilder()
         .setColor("Gold")
         .setDescription(args.join(""));

      message?.channel.send({
         embeds: [embed],
      });
   },
} as CommandObject;
