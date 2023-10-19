import mongoose from "mongoose";

interface IUser {
  name: string;
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
