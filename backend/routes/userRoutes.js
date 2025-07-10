const express = require("express");
const {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/create", registerUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);



module.exports = router;
