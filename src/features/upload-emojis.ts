import { Client } from "discord.js";
import WOK from "../CommandHandler";

const fs = require("fs");
const path = require("path");

export default async (instance: WOK, client: Client) => {
   // Get all the emojis
   const emojisDir = path.resolve("./public/emojis");
   const emojis = fs.readdirSync(emojisDir);

   // Add all the emojis to the current guilds
   for (const [_, guild] of client.guilds.cache) {
      for (const emoji of emojis) {
         const isEmoji = !!guild.emojis.cache.find(
            (e) => e.name === emoji.replace(".png", "").replace(".gif", "")
         );

         if (isEmoji) {
            continue;
         }

         // Upload the emoji
         await guild.emojis
            .create({
               attachment: path.join(emojisDir, emoji),
               name: emoji.replace(".png", "").replace(".gif", ""),
            })
            .then(() =>
               console.log(
                  `Added ${emoji
                     .replace(".png", "")
                     .replace(".gif", "")} as an emoji`
               )
            )
            .catch(() => null);
      }
   }

   // Add the emojis to the new guild
   client.on("guildCreate", async (guild) => {
      // Loop through all the emojis
      for (const emoji of emojis) {
         const isEmoji = !!guild.emojis.cache.find(
            (e) => e.name === emoji.replace(".png", "").replace(".gif", "")
         );

         if (isEmoji) {
            continue;
         }

         // Upload the emoji
         await guild.emojis
            .create({
               attachment: path.join(emojisDir, emoji),
               name: emoji.replace(".png", "").replace(".gif", ""),
            })
            .then(() =>
               console.log(
                  `Added ${emoji
                     .replace(".png", "")
                     .replace(".gif", "")} as an emoji`
               )
            )
            .catch(() => null);
      }
   });
};
