const mongooese = require("mongoose");
const becrypt = require("bcryptjs");
const UserSchema = mongooese.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [5, "name must be at least 5"],
      maxlength: [20, "name too long"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [5, "password must be at least 5"],
      maxlength: [20, "password too long"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },

  { timestamps: true },
);
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await becrypt.hash(this.password, 12);
});
module.exports = mongooese.model("User", UserSchema);
