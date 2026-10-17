const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  getLoogedUserData,
  changeLoggedUserPassword,
  updateLogedUser,
} = require("../../services/user/user_service");
const {
  createUserValidator,
  getUserValidator,
  changePasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../../utils/validators/user/user_validator");

const router = express.Router();
const AuthService = require("../../services/auth/auth_service");

router.get("/getMe", AuthService.protect, getLoogedUserData, getUserById);
router.put("/changePassword/:id", changePasswordValidator, changePassword);
router.put(
  "/changeLoggedUserPassword",
  AuthService.protect,
  changeLoggedUserPasswordValidator,
  changeLoggedUserPassword,
);
router.put(
  "/updateLoggedUser",
  AuthService.protect,
  updateLoggedUserValidator,
  updateLogedUser,
);

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
