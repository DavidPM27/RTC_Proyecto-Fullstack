const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, required: true, unique: true },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [6, "Password requires at least 6 characters"],
    },
    email: { type: String, trim: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    image: { type: String, trim: true },
    plants: [
      {
        plant: { type: mongoose.Schema.Types.ObjectId, ref: "plants" },
        lastWatered: { type: Date },
      }
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  this.role = "user";
  next();
});

const User = mongoose.model("users", userSchema);
module.exports = User;
