const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");
const { createTokenForUser } = require("../services/authentication");
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "ADMIN",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function ( next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
    

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const userFromDb = await this.findOne({email})
    if (!userFromDb) throw new Error("User not found in Db !!")
      const salt= userFromDb.salt;
    const hashedPassword =userFromDb.password;

    const userProvidedPasswordHash =createHmac("sha256",salt).update(password).digest("hex");

    if (hashedPassword !==userProvidedPasswordHash) {
      throw new Error("Incorrect password")
    }

    const token = createTokenForUser(userFromDb)
    return token

  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
