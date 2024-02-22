import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import requiredPermissions from "../../../models/required-permissions-schema";
import Command from "../../Command";
import { CommandUsage } from "../../../typings";
import config from "../../../../config.json";

export default async (command: Command, usage: CommandUsage) => {
   const { permissions = [] } = command.commandObject;
   const { instance, guild, member, message, interaction } = usage;

   if (!member) {
      return true;
   }

   if (instance.isConnectedToDB) {
      const document = await requiredPermissions.findById(
         `${guild!.id}-${command.commandName}`
      );
      if (document) {
         for (const permission of document.permissions) {
            if (!permissions.includes(permission)) {
               permissions.push(permission);
            }
         }
      }
   }

   if (permissions.length) {
      const missingPermissions: string[] = [];

      for (const permission of permissions) {
         // @ts-ignore
         if (!member.permissions.has(permission)) {
            const permissionObject = Object.entries(PermissionFlagsBits).find(
               ([_, value]) => value === permission
            ) || [""];

            const permissionName = permissionObject[0];
            missingPermissions.push(permissionName);
         }
      }

      if (missingPermissions.length) {
         // Create an embed
         const missingPermissionsEmbed = new EmbedBuilder()

            .setTitle("❌ Missing Permissions")
            .setColor("Red")
            .setDescription(
               `You are missing the following permissions: \`${missingPermissions.join(
                  "`, `"
               )}\``
            );

         // TODO: Add the missing permissions GIF

         if (message) {
            message.reply({
               embeds: [missingPermissionsEmbed],
            });
         } else if (interaction) {
            interaction.reply({
               embeds: [missingPermissionsEmbed],
               ephemeral: true,
            });
         }

         return false;
      }
   }

   return true;
};
