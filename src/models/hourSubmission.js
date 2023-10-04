import mongoose from "mongoose";

const { Schema, SchemaTypes } = mongoose;

const HourSchema = new Schema({
  date: { type: Date, required: true },
  person: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  numHours: { type: Number, required: true },
  reason: { type: String, required: true },
});

HourSchema.virtual("url").get(function () {
  return "/";
});

export default mongoose.model("Submission", HourSchema);
