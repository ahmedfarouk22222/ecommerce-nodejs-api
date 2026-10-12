const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} = require("../../services/user/user_service");
const {
  createUserValidator,
  getUserValidator,
} = require("../../utils/validators/user/user_validator");

const router = express.Router();
router.put("/changePassword/:id", changePassword);

router.route("/").post(createUserValidator, createUser).get(getUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
