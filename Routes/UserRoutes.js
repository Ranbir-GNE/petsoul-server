const {
  register,
  login,
  getUserById,
  updateUser,
  deleteUser,
  getUserFromToken,
} = require("../Controllers/UserController");
const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getUserById);
router.get("/token/:token", getUserFromToken);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
