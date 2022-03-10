const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
      role,
    });
    sendToken(user, 201, res);
    return;
  } catch (error) {
    next(error);
  }
};

exports.loging = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse(
        "Indique o teu nome de usuário ou endereço de email e password",
        400
      )
    );
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Credenciais inválidas", 401));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Credenciais inválidas", 301));
    }
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    //   next(error)
  }
  res.send("Login Route");
};

exports.retrievePassword = (req, res, next) => {
  res.send("Password Retrieval Route");
};

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorResponse(
          "Endereço de email não enviado pelo servidor",
          404
        )
      );
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:6000/${resetToken}`;
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
    } catch (error) {}
  } catch (error) {}
};


const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
  });
};
