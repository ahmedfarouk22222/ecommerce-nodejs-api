const mongooese = require("mongoose");
const UserSchema = mongooese.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
      minlength: [5, "name must be at least 5"],
      maxlength: [20, "name to long"],
    },
    slug: { type: String, lowercase: true },
    email: {
      type: String,
      require: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "password is required"],
      minlength: [5, "password must be at least 5"],
      maxlength: [20, "password to long"],
    },
    role: {
      type: [],
      enum: ["user", "admin"],
      default: "user",
    },
  },

  { timestamps: true },
);
module.exports = mongooese.model("User", UserSchema);
