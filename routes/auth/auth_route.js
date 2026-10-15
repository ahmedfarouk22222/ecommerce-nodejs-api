const express = require("express");
const {
  signUp,
  login,
  forgetPassword,
} = require("../../services/auth/auth_service");
const {
  signUpValidator,
  LoginValidator,
  forgetPasswordValidator,
} = require("../../utils/validators/auth/auth_validator");

const router = express.Router();

router.route("/signUp").post(signUpValidator, signUp);
router.route("/Login").post(LoginValidator, login);
router.route("/forgetPassword").post(forgetPasswordValidator, forgetPassword);

// router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
