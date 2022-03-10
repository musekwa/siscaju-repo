const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.route("/registration").post(register);
router.route("/login").post(login);
router.route("/password-retrieval").post(retrievePassword);
router.route("/password-resetting").put(resetPassword);

module.exports = router;
