// Main Bot Libraries
import {
   Client,
   GatewayIntentBits,
   Collection,
   LimitedCollection,
   Interaction,
} from "discord.js";
import WOK, { DefaultCommands } from "wokcommands";

// Utils and Config
import "dotenv/config";
import path from "path";

// Create the custom client class
export default class ForHonorBot extends Client {
   constructor() {
      super({
         intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
         ],
         makeCache: (manager) => {
            switch (manager.name) {
               case "ThreadMemberManager":
               case "ApplicationCommandManager":
               case "BaseGuildEmojiManager":
               case "GuildEmojiManager":
               case "GuildInviteManager":
               case "GuildStickerManager":
               case "StageInstanceManager":
               case "PresenceManager":
               case "MessageManager":
               case "GuildBanManager":
               case "ThreadManager":
               case "ReactionUserManager":
               case "VoiceStateManager":
               case "AutoModerationRuleManager":
                  return new LimitedCollection({ maxSize: 0 });
               case "GuildMemberManager":
                  return new LimitedCollection({
                     maxSize: 20000,
                     keepOverLimit: (member) =>
                        member.id === member.client.user.id,
                  });
               case "UserManager":
                  return new LimitedCollection({
                     maxSize: 20000,
                     keepOverLimit: (user) => user.id === user.client.user.id,
                  });
               default:
                  return new Collection();
            }
         },
      });

      this.on("ready", (client) => {
         new WOK({
            client: this,
            mongoUri: process.env.MONGO_URI,
            commandsDir: path.join(__dirname, "../commands"),
            featuresDir: path.join(__dirname, "../features"),
            testServers: ["1113578378788868270"],
            botOwners: ["526782947123134465"],
            defaultPrefix: "fh!",

            disabledDefaultCommands: [
               DefaultCommands.ChannelCommand,
               DefaultCommands.CustomCommand,
               DefaultCommands.Prefix,
               DefaultCommands.RequiredPermissions,
               DefaultCommands.RequiredRoles,
               DefaultCommands.ToggleCommand,
            ],

            cooldownConfig: {
               errorMessage: "You cannot use that for another {TIME}",
               botOwnersBypass: false,
               dbRequired: 300,
            },

            events: {
               dir: path.join(__dirname, "../events"),
               interactionCreate: {
                  isModal: (interaction: Interaction) =>
                     interaction.isModalSubmit(),
                  isMenu: (interaction: Interaction) =>
                     interaction.isStringSelectMenu(),
               },
            },

            validations: {
               // runtime: path.join(__dirname, "../validations", "runtime"),
               // syntax: join(__dirname, "validations", "syntax"),
            },
         });
      });
   }

   /**
    * Login the bot client
    */
   public async loginBot() {
      return this.login(process.env.DISCORD_TOKEN);
   }
}
