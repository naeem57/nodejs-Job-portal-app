const express = require("express");
const { updateUser } = require("../controllers/user-controller.js");
const protect = require("../middlewares/auth-middleware.js");

const router = express.Router();

router.put("/update", protect, updateUser);

module.exports = router;
