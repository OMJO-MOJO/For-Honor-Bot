import { Message } from "discord.js";
import WOK from "wokcommands";

export default (message: Message, instance: WOK) => {
   console.log(message.content);
};
