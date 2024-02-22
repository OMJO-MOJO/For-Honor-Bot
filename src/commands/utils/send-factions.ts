import {
   ActionRowBuilder,
   EmbedBuilder,
   GuildEmoji,
   StringSelectMenuBuilder,
   StringSelectMenuOptionBuilder,
} from "discord.js";
import { CommandObject, CommandUsage } from "../../typings";

export default {
   description: "Send the role select embed",

   type: "LEGACY",
   ownerOnly: true,

   // Invoked when a user runs the command
   callback: async ({ message, guild, args }: CommandUsage) => {
      message?.delete();

      // Fetch all the emojis from the server
      const emojis = await guild?.emojis.fetch();

      // Generate the embed
      const embed = new EmbedBuilder()
         .setColor(0xee4b2b)
         .setAuthor({
            name: "Choose your Faction",
            iconURL: "https://imgur.com/oKBeE2U.png",
         })
         .setDescription(
            `> Choose one of the factions from below by using the select menu!`
         );

      // Get all the emojis for the factions
      const knightEmoji = emojis
         ?.map((emoji: GuildEmoji) => emoji)
         .find((emoji: GuildEmoji) => emoji.name === "knight");
      const samuraiEmoji = emojis
         ?.map((emoji: GuildEmoji) => emoji)
         .find((emoji: GuildEmoji) => emoji.name === "samurai");
      const vikingEmoji = emojis
         ?.map((emoji: GuildEmoji) => emoji)
         .find((emoji: GuildEmoji) => emoji.name === "viking");
      const wulinEmoji = emojis
         ?.map((emoji: GuildEmoji) => emoji)
         .find((emoji: GuildEmoji) => emoji.name === "wulin");
      const outlanderEmoji = emojis
         ?.map((emoji: GuildEmoji) => emoji)
         .find((emoji: GuildEmoji) => emoji.name === "outlandler");

      // Generate the options for the select menu
      const factionOptions: StringSelectMenuOptionBuilder[] = [
         new StringSelectMenuOptionBuilder()
            .setLabel("Knight")
            .setValue("knight")
            .setDescription("Join the Knights!")
            .setEmoji(
               knightEmoji ? `<:${knightEmoji.name}:${knightEmoji.id}>` : "❔"
            ),

         new StringSelectMenuOptionBuilder()
            .setLabel("Samurai")
            .setValue("samurai")
            .setDescription("Join the Samurai!")
            .setEmoji(
               samuraiEmoji
                  ? `<:${samuraiEmoji.name}:${samuraiEmoji.id}>`
                  : "❔"
            ),

         new StringSelectMenuOptionBuilder()
            .setLabel("Viking")
            .setValue("viking")
            .setDescription("Join the Vikings!")
            .setEmoji(
               vikingEmoji ? `<:${vikingEmoji.name}:${vikingEmoji.id}>` : "❔"
            ),

         new StringSelectMenuOptionBuilder()
            .setLabel("Wu Lin")
            .setValue("wu-lin")
            .setDescription("Join the Wu Lin!")
            .setEmoji(
               wulinEmoji ? `<:${wulinEmoji.name}:${wulinEmoji.id}>` : "❔"
            ),

         new StringSelectMenuOptionBuilder()
            .setLabel("Outlanders")
            .setValue("outlanders")
            .setDescription("Join the Outlanders!")
            .setEmoji(
               outlanderEmoji
                  ? `<:${outlanderEmoji.name}:${outlanderEmoji.id}>`
                  : "❔"
            ),
      ];

      // Generate the select menu
      const selectmenu = new ActionRowBuilder().addComponents(
         new StringSelectMenuBuilder()
            .setCustomId("faction-select")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Select a faction...")
            .setOptions(factionOptions)
      ) as any;

      // Send the message
      message?.channel.send({
         files: ["./public/Factions-Header.png"],
         embeds: [embed],
         components: [selectmenu],
      });
   },
} as CommandObject;
