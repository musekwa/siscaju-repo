const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Indique o teu nome de usuário"],
      unique: [true, "Este nome de usuário já existe"],
    },
    email: {
      type: String,
      required: [true, "Indique o teu enderço de email"],
      unique: [true, "Este enderço de email já existe"],
      select: false,
      validate: [isEmail, "Indique um endereço de email válido"],
    },
    password: {
      type: String,
      required: [true, "Introduza o teu password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["Produtor", "Extensionista", "Gestor"],
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(10).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
