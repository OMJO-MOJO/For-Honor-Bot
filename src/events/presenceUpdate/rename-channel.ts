import { Presence } from "discord.js";
import config from "../../config.json";
import WOK from "../../CommandHandler";

const emojis: string[] = [
   "🎮",
   "🔊",
   "🎶",
   "🎧",
   "🎷",
   "🎺",
   "🎵",
   "💣",
   "⚡",
   "🔥",
   "🔰",
];

export default async (
   oldPresence: Presence,
   newPresence: Presence,
   instance: WOK
) => {
   // Check if the user is connected to a voice channe
   const channel = (await newPresence.guild?.members.fetch(newPresence.userId))
      ?.voice.channel;

   if (!channel) {
      return;
   }

   if (channel.id === config.create_vc_channel_id) {
      return;
   }

   if (channel.parentId !== config.voice_category_id) {
      return;
   }

   // Track the total user activities to determine the most played activity
   const activities = new Map<string, number>();

   // Get the presence of all the members in the voice channel
   for (const [userId, member] of channel.members || new Map()) {
      if (!member.presence) {
         continue;
      }

      // Check if the user is playing something
      if (!member.presence.activities.length) {
         continue;
      }

      if (member.presence.activities[0]?.name === "Custom Status") {
         member.presence.activities.shift();
      }

      // Check if the user is playing something
      if (!member.presence.activities.length) {
         continue;
      }

      // Record the current count
      activities.set(
         member.presence.activities[0].name,
         (activities.get(member.presence.activities[0].name) || 0) + 1
      );
   }

   // Create the first half of the name
   let name: string;

   // Generate the second half of the name
   if (activities.size <= 0) {
      name = "Chill";
   } else {
      const acts = [...activities.entries()].sort();

      if (acts.length >= 2) {
         if (acts[0][1] === acts[1][1]) {
            name = "Mulitple Games";
         }
      } else {
         name = acts[0][0] || "Chill";
      }
   }

   // Check if the current name
   if (channel.name.split("・")[1] === name!) {
      return;
   }

   name = `${emojis[Math.floor(Math.random() * emojis.length)]}・${
      name! || "Chill"
   }`;

   // Update the channel's name
   channel.setName(name!, "Updated the channel name");
};
