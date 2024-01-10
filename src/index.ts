/*

   🔥 Repository: https://github.com/OMJO-MOJO/For-Honor-Bot

   📚 Documentation: TODO

*/

import { white, gray, blue } from "chalk-advanced";
import ForHonorBot from "./utils/ForHonorBot";

// Create the discord client
const client = new ForHonorBot();
client.loginBot().then(() => {
   console.log(
      `${blue("For Honor Bot")} ${gray(">")} ${white(
         "Bot should be started now..."
      )}`
   );
});
