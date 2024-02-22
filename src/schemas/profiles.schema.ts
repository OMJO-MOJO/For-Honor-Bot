import { Schema, model, models } from "mongoose";

const profilesSchema = new Schema({
   // The UserId
   _id: {
      type: String,
      required: true,
   },

   faction: {
      type: String,
      required: false,
      default: null,
   },

   heros: [
      {
         type: String,
         required: false,
         default: [],
      },
   ],

   rank: {
      type: Number,
      required: false,
      default: 0,
   },
});

const name = "profiles";
export default models[name] || model(name, profilesSchema);
