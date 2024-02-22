import { ChannelType, VoiceState } from "discord.js";
import config from "../../config.json";
import WOK from "../../CommandHandler";

const VoiceTypes = {
   JOIN: "JOIN",
   LEAVE: "LEAVE",
   MOVE: "MOVE",
   UNKNOWN: "UNKNOWN",
};

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
   oldVoiceState: VoiceState,
   newVoiceState: VoiceState,
   instance: WOK
) => {
   // Determine if the user has joined, left, or moved VSs
   const type: string =
      !oldVoiceState.channelId && newVoiceState.channelId
         ? VoiceTypes.JOIN
         : oldVoiceState.channelId && !newVoiceState.channelId
         ? VoiceTypes.LEAVE
         : oldVoiceState.channelId && newVoiceState.channelId
         ? VoiceTypes.MOVE
         : VoiceTypes.UNKNOWN;

   // Check if the user has left their voice channel
   if (
      (type === VoiceTypes.LEAVE || type === VoiceTypes.MOVE) &&
      oldVoiceState.channel?.parentId === config.voice_category_id &&
      oldVoiceState.channelId !== config.create_vc_channel_id
   ) {
      // Check if the channel is empty
      if (oldVoiceState.channel.members.size > 0) {
         return;
      }

      // Delete the channel as it's empty
      oldVoiceState.channel
         .delete(`Everyone has left ${oldVoiceState.channel.name}`)
         .catch((ignored) => null);
   }

   // Check if the user has joined the JOIN VC channel
   if (
      (type === VoiceTypes.JOIN || type === VoiceTypes.MOVE) &&
      newVoiceState.channelId === config.create_vc_channel_id
   ) {
      // Genrate the channel's name through the user's presence
      let name: string = `${
         emojis[Math.floor(Math.random() * emojis.length)]
      }・`;

      if (newVoiceState.member?.presence?.activities.length) {
         name += newVoiceState.member?.presence?.activities[0].name || "Chill";
      } else {
         name += "Chill";
      }

      // Create the user's channel
      const userChannel = await newVoiceState.guild.channels
         .create({
            name,
            type: ChannelType.GuildVoice,
            bitrate: 96000,
            parent: config.voice_category_id,
            reason: `${
               newVoiceState.member?.displayName ||
               newVoiceState.member?.user.username
            } has created a voice channel.`,
         })
         .catch((ignored) => null);

      // Move the member to the new voice channel
      newVoiceState.member?.voice
         .setChannel(
            userChannel,
            `Moved ${
               newVoiceState.member?.displayName ||
               newVoiceState.member?.user.username
            } to their voice channel.`
         )
         .catch((ignored) => null);
   }

   // Check if the user has joined one of the created voice channels
   if (
      // type === VoiceTypes.JOIN &&
      oldVoiceState.channel?.parentId === config.voice_category_id ||
      newVoiceState.channel?.parentId === config.voice_category_id
   ) {
      // Get the voice state
      let voiceState: VoiceState;
      switch (type) {
         case VoiceTypes.JOIN:
            voiceState = newVoiceState;
            break;

         case VoiceTypes.LEAVE:
            voiceState = oldVoiceState;
            break;

         case VoiceTypes.MOVE:
            voiceState =
               oldVoiceState.channel?.parentId === config.voice_category_id
                  ? oldVoiceState
                  : newVoiceState;
            break;
         default:
            voiceState = newVoiceState;
      }

      // Track the total user activities to determine the most played activity
      const activities = new Map<string, number>();

      // Get the presence of all the members in the voice channel
      for (const [userId, member] of voiceState.channel?.members || new Map()) {
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

         console.log(member.presence.activities);

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
         name =
            [...activities.entries()].reduce((a, e) =>
               e[1] > a[1] ? e : a
            )[0] || "Chill";
      }

      // Check if the current name
      if (voiceState.channel?.name.split("・")[1] === name) {
         return;
      }

      name = `${emojis[Math.floor(Math.random() * emojis.length)]}・${
         name || "Chill"
      }`;

      // Update the channel's name
      voiceState.channel?.setName(name, "Updated the channel name");
   }
};
