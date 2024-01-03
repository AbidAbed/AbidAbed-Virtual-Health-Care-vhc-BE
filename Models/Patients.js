import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const PatientsSchema = new Schema({
  _id: { type: Schema.Types.UUID, default: uuidv4 },
  name: String,
  email: String,
  reviews: [Schema.Types.UUID],
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
});

const Patients = mongoose.model("Patients", PatientsSchema);

export default Patients;
