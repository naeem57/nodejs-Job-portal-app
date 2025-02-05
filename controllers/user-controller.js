const User = require("../models/user-model.js");

const updateUser = async (req, res, next) => {
  const userId = req.user.id;
  const { name, lastName, email, location } = req.body;

  if (!name || !lastName || !email || !location) {
    return res.status(400).json({ message: "Please provide all fields!" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();
  const token = user.createJWT();

  res.status(200).json({ message: "update user successfully!", token, user });
};

module.exports = { updateUser };
