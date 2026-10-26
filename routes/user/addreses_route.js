const express = require("express");
const {
  addToAddresses,
  removeFromAddresses,
  getAddresses,
} = require("../../services/user/address_service");
const AuthService = require("../../services/auth/auth_service");

const router = express.Router();

router.post(
  "/",
  AuthService.protect,
  AuthService.allowedTo("user"),
  addToAddresses,
);
router.delete(
  "/:addressId",
  AuthService.protect,
  AuthService.allowedTo("user"),
  removeFromAddresses,
);
router.get(
  "/",
  AuthService.protect,
  AuthService.allowedTo("user"),
  getAddresses,
);
module.exports = router;
