import {
   EmbedBuilder,
   GuildBasedChannel,
   GuildMember,
   GuildTextBasedChannel,
   TextChannel,
} from "discord.js";
import config from "../../config.json";
import Canvas from "canvas";
import path from "path";
import WOK from "../../CommandHandler";

const defaultAvaters: string[] = ["warden"];
let channel: TextChannel;

export default async (member: GuildMember, instance: WOK) => {
   // Disabled for a more simplistic way
   return;

   // Check if the new member is a bot
   if (member.user.bot) return;

   // Fetch the welcome channel
   if (!channel) {
      channel = (await member.guild.channels.fetch(
         config.welcome_channel_id
      )) as TextChannel;
   }

   // Create the canvas with the dimentions
   const canvas = Canvas.createCanvas(700, 300);
   const ctx = canvas.getContext("2d");

   let x = 0;
   let y = 0;

   // Profile Picture - height = 128
   const pfp = await Canvas.loadImage(
      member.displayAvatarURL({ extension: "png" }) ||
         path.join(
            path.resolve("./"),
            `public/${
               defaultAvaters[Math.floor(Math.random() * defaultAvaters.length)]
            }.png`
         )
   );
   x = 50;
   y = canvas.height / 2 - pfp.height / 2;
   ctx.drawImage(pfp, x, y, 128, 128);

   // Load the Background

   const lowerBackground = await Canvas.loadImage(
      path.join(path.resolve("./"), "public/welcome-blur-pfp.png")
   );
   x = 0;
   y = 0;
   ctx.drawImage(lowerBackground, x, y);

   // User
   ctx.fillStyle = `#000000`;
   ctx.font = "bold 60px Arial";
   x = 75 + pfp.width;
   y = canvas.height / 2 + 40 / 2;
   ctx.fillText(member.displayName || member.user.username, x, y);

   // Create the embed
   const welcomeembed = new EmbedBuilder()
      .setColor(0xee4b2b)
      .setDescription(
         `Let's all give a warm welcome to **${
            member.displayName || member.user.username
         }**! We hope you enjoy your stay in **${member.guild.name}**!`
      );

   // Send the message
   channel
      .send({
         embeds: [welcomeembed],
      })
      .then(() => {
         channel
            .send({
               files: [canvas.toBuffer()],
            })
            .catch((err: any) => console.log(err));
      })
      .catch((err: any) => console.log(err));
};
