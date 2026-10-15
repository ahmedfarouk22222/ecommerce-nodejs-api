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
  changePasswordValidator,
} = require("../../utils/validators/user/user_validator");

const router = express.Router();
const AuthService = require("../../services/auth/auth_service");

router.put("/changePassword/:id", changePasswordValidator, changePassword);

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    createUserValidator,
    createUser,
  )
  .get(AuthService.protect, AuthService.allowedTo("admin"), getUsers);
router
  .route("/:id")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getUserById)
  .put(AuthService.protect, AuthService.allowedTo("admin"), updateUser)
  .delete(AuthService.protect, AuthService.allowedTo("admin"), deleteUser);

module.exports = router;
