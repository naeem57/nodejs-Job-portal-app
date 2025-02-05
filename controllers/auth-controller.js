const User = require("../models/user-model.js");
const bcrypt = require("bcryptjs");

//register user
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  //validate
  if (!name || !email || !password) {
    next("All fields are required!");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    next("Email already registerd please login");
  }

  //hashed passwprd
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ message: "User registerd successfully!", user });
};

//login user
const login = async (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    next("please provide all fileds!");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid email or password!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    next("Inavlid password!");
  }

  user.password = undefined;
  const token = user.createJWT();
  return res.status(200).json({
    message: "Login successfully!",
    token,
    user,
  });
};

module.exports = {
  registerUser,
  login,
};
