import mongoose, { connect } from "mongoose";

export const dbConnect = async () => {
  await mongoose.connect(process.env.URI);
  console.log("Connected to db");
};
