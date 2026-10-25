const express = require("express");
const { addToWishList, removeFromWishList, getWishList } = require("../../services/user/add_to_wish_list_service");
const AuthService = require("../../services/auth/auth_service");

const router = express.Router();

router.post("/", AuthService.protect, AuthService.allowedTo("user"), addToWishList);
router.delete("/", AuthService.protect, AuthService.allowedTo("user"), removeFromWishList);
router.get("/", AuthService.protect, AuthService.allowedTo("user"), getWishList);
module.exports = router;