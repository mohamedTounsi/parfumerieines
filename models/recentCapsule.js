import mongoose from "mongoose";

const recentCapsuleSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RecentCapsule =
  mongoose.models.RecentCapsule ||
  mongoose.model("RecentCapsule", recentCapsuleSchema);

export default RecentCapsule;
