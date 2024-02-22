import { blue, gray, white } from "chalk-advanced";
import { Client, GuildMember } from "discord.js";
import WOK from "../CommandHandler";

export default async (instance: WOK, client: Client) => {
   console.log(
      `${blue("For Honor Bot")} ${gray(">")} ${white(
         "Bot is online and ready"
      )}`
   );

   // Emit the guild member add event
   const member: GuildMember = await client.guilds.cache
      .get("1194398804540141738")
      ?.members.fetch("526782947123134465")!;

   //    console.log(member);

   setTimeout(() => client.emit("guildMemberAdd", member), 1000);
};
