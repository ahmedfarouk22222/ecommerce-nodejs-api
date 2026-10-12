const express = require("express");
const { signUp } = require("../../services/auth/auth_service");
const {
  signUpValidator,
} = require("../../utils/validators/auth/auth_validator");

const router = express.Router();

router.route("/signUp").post(signUpValidator, signUp);
// router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
