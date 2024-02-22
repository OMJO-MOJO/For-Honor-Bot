import {
   ApplicationCommandOptionType,
   EmbedBuilder,
   GuildMember,
} from "discord.js";
import profilesSchema from "../../schemas/profiles.schema";
import { CommandObject, CommandUsage } from "../../typings";

export default {
   description: "View your server profile",

   type: "SLASH",
   testOnly: true,

   options: [
      {
         name: "user",
         description: "View a member's profile",
         type: ApplicationCommandOptionType.User,
         required: false,
      },
   ],

   // Invoked when a user runs the command
   callback: async ({ interaction, member: m, guild, args }: CommandUsage) => {
      let member: GuildMember | null = m!;
      if (args.length > 0) {
         member =
            (await guild?.members
               .fetch(args[0])
               .then((member: GuildMember) => member)
               .catch(() => null)) || null;
      }

      if (!member) {
         return interaction?.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor(0xee4b2b)
                  .setTitle("❌ Member not found")
                  .setDescription(
                     `No member was found using the id of \`${args[0]}\`.`
                  ),
            ],
         });
      }

      // Fetch the user's profile from the database
      const profile = await profilesSchema.findOne({
         _id: args[0] || interaction?.member?.user.id,
      });

      // Generate the embed
      const profileembed = new EmbedBuilder().setColor(0xee4b2b).setAuthor({
         name: `${member?.user.username}'s Profile`,
         iconURL: member?.displayAvatarURL(),
      });

      interaction?.reply({
         embeds: [profileembed],
      });
   },
} as CommandObject;
