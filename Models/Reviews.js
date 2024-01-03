import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ReviewsSchema = new Schema({
  _id: { type: Schema.Types.UUID, default: uuidv4 },
  rate: Number,
  comment: String,
  doctor_id: Schema.Types.UUID,
  patient_id: Schema.Types.UUID,
  time: Number,
});

const Reviews = mongoose.model("Reviews", ReviewsSchema);

export default Reviews;
