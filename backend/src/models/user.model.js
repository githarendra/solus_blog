import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,7);
});

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password);
}

export const User = mongoose.model("User", userSchema);
