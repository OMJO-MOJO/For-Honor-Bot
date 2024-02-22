import { EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import profilesSchema from "../../../schemas/profiles.schema";
import WOK from "../../../CommandHandler";

export default async (
   interaction: StringSelectMenuInteraction,
   instance: WOK
) => {
   if (interaction.customId !== "faction-select") {
      return;
   }

   let faction = "faction_not_found";
   switch (interaction.values[0]) {
      case "knight":
         faction = "Knight";
         break;

      case "samurai":
         faction = "Samurai";
         break;

      case "viking":
         faction = "Viking";
         break;

      case "wu-lin":
         faction = "Wu Lin";
         break;

      case "outlanders":
         faction = "outlanders";
         break;
   }

   // Save the information to the database
   await profilesSchema.findOneAndUpdate(
      { _id: interaction.member?.user.id },
      {
         _id: interaction.member?.user.id,
         faction: interaction.values[0],
      },
      { upsert: true }
   );

   const factionembed = new EmbedBuilder(interaction.message.embeds[0].data)
      .setAuthor({
         name: "Faction selected!",
         iconURL: "https://imgur.com/oKBeE2U.png",
      })
      .setDescription(`> Your faction has been updated to \`${faction}\`!`);

   interaction.reply({
      embeds: [factionembed],
      ephemeral: true,
   });
};
