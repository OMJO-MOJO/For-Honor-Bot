import profilesSchema from "../schemas/profiles.schema";
import { Profile, UserId } from "../typings";
import ForHonorBot from "../utils/ForHonorBot";
import config from "../config.json";

class LeaderboardManager {
   private readonly client: ForHonorBot;
   public profiles: Map<UserId, Profile> = new Map<UserId, Profile>();

   constructor(client: ForHonorBot) {
      this.client = client;

      // Fetch all the profiles
      this.init();
   }

   /**
    * Fetch all the profiles from the database
    */
   private async init() {
      // Fetch all the profiles from the database
      const profiles = (await profilesSchema.find({})) as Profile[];

      // Load all the profiles to the cache
      for (const profile of profiles) {
         this.profiles.set(profile._id, profile);
      }
   }

   /**
    * Get the leaderboard of all the players
    */
   public async leaderboard(): Promise<Profile[]> {
      // All the profiles
      const profiles: Profile[] = [];

      // Fetch all the members from the server
      const members =
         (await this.client.guilds.cache
            .get(config.guild_id)
            ?.members.fetch()) || new Map();

      // Format the profiles into a usable format
      for (const [_userId, profile] of this.profiles) profiles.push(profile);

      // Format the users into a usable format
      for (const [userId, member] of members) {
         // Check if the user already has a profile
         if (profiles.find((profile) => profile._id === userId)) {
            continue;
         }

         // Add the member to the array
         profiles.push({ _id: member.user.id, rank: 0 });
      }

      // Sort the users by their rank
      profiles.sort((a, b) => (b.rank || 0) - (a.rank || 0));

      return profiles;
   }
}

export default LeaderboardManager;
