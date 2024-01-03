import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const DoctorSchema = new Schema({
  _id: { type: Schema.Types.UUID, default: uuidv4 },
  name: String,
  email: String,
  proficiency: String,
  bio: String,
  reviews: [Schema.Types.UUID],
  rate: Number,
  ratingSum: { type: Number, default: 0 },
  chat: {
    type: Map,
    of: [
      {
        sender_id: Schema.Types.UUID,
        msg: String,
        time: Number,
      },
    ],
    default: new Map(),
  },
  appointments: [Schema.Types.UUID],
  availableTimes: [
    {
      startTime: {
        type: Number,
        required: true,
      },
      endTime: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Doctors = mongoose.model("Doctors", DoctorSchema);

export default Doctors;
