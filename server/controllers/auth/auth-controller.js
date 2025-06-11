const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists with same Email Id, Try again!",
      });
    }

    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashpassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
};

//Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
        userName: existingUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );
    res.status(200).json({
      success: true,
      message: "Successfully Logged In",
      token,
      user: {
        id: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
        userName: existingUser.userName,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Logging User",
    });
  }
};

//Logout
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "User Logged Out",
  });
};

//authMiddleware
const authMiddleware = async (req, res, next) => {
  // console.log("Authorization Header:", req.headers.authorization);
  // console.log("Token:", req.header("Authorization"));
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};
