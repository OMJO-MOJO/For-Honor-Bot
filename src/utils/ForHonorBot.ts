// Main Bot Libraries
import {
   Client,
   GatewayIntentBits,
   Interaction,
   ActivityType,
} from "discord.js";
import WOK, { DefaultCommands } from "../CommandHandler/";

// Utils and Config
import "dotenv/config";
import path from "path";
import ProfileManager from "../Managers/ProfileManager";

const statuses = [
   "Incredibilis!",
   "Incontinens!",
   "Infirmus!",
   "Etiam!",
   "Io!",
   "Paratus sum!",
   "Surgo!",
   "Valeo!",
   "Vivo!",
];

// Create the custom client class
export default class ForHonorBot extends Client {
   public profiles!: ProfileManager;

   constructor() {
      super({
         intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
         ],
      });

      // Wait for the client to be ready
      this.on("ready", (client) => {
         let i = 0;
         client.user.setPresence({
            activities: [{ name: statuses[i], type: ActivityType.Listening }],
            status: "dnd",
         });

         // The leaderboard manager
         this.profiles = new ProfileManager(this);

         setInterval(() => {
            if (i === statuses.length - 1) i = 0;
            else i++;

            // Set the status of the bot
            client.user.setPresence({
               activities: [
                  { name: statuses[i], type: ActivityType.Listening },
               ],
               status: "dnd",
            });
         }, 5 * 60 * 1000);

         // Init the command handler
         new WOK({
            client: this,
            mongoUri: process.env.MONGO_URI,
            commandsDir: path.join(__dirname, "../commands"),
            featuresDir: path.join(__dirname, "../features"),
            testServers: ["1194398804540141738"],
            botOwners: [
               "526782947123134465", // OMJO
               "985208697053663372", // Blondy
               "324570286068334592", // SlightSight
            ],
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
