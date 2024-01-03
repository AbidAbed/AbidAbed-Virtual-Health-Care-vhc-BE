import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const AppointmentsSchema = new Schema({
  _id: { type: Schema.Types.UUID, default: uuidv4 },
  time: Number,
  doctor_id: Schema.Types.UUID,
  patient_id: Schema.Types.UUID,
});

const Appointments = mongoose.model("Appointments", AppointmentsSchema);

export default Appointments;
