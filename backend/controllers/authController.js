const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Login = require("../models/Login");

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { name, mobile, email, password, dob, role } = req.body;

  // Check if login already exists
  const existingLogin = await Login.findOne({ email });
  if (existingLogin) return res.status(400).json({ message: "Email already exists" });

  // Create user
   const user = await User.create({ name, mobile, dob, role, email });


  // Save login credentials
  const hashedPassword = await bcrypt.hash(password, 10);
  await Login.create({ email, password: hashedPassword, userId: user._id });

  res.status(201).json({ message: "Registered successfully" });
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find login
  const login = await Login.findOne({ email });
  if (!login) return res.status(400).json({ message: "Invalid Email" });

  const isMatch = await bcrypt.compare(password, login.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

  // Get user
  const user = await User.findById(login.userId);

  user.isLoggedIn = true;
  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({
    message: "Login successful",
    token,
    aadhaarVerified: user.aadhaarVerified,
    role: user.role,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      dob: user.dob,
      role: user.role,
    },
  });
};

// ================= CURRENT USER =================
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-otp -otpExpires -__v");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
};

// ================= UPDATE CURRENT USER =================
exports.updateMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const {
    fullname,
    dob,
    email,
    mode,
    domain,
    profileDetails,
  } = req.body;

  if (fullname) {
    user.name = fullname;
  }

  if (dob) {
    user.dob = dob;
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const login = await Login.findOne({ userId: user._id });
    if (login) {
      login.email = email;
      await login.save();
    }

    user.email = email;
  }

  if (!user.profile) {
    user.profile = {};
  }

  if (domain !== undefined) {
    user.profile.domain = domain;
  }

  if (mode !== undefined) {
    user.profile.availability = mode;
  }

  if (profileDetails) {
    user.profileDetails = {
      ...(user.profileDetails?.toObject ? user.profileDetails.toObject() : user.profileDetails),
      ...profileDetails,
    };
  }

  await user.save();

  const updatedUser = await User.findById(req.user.id).select("-otp -otpExpires -__v");
  res.json({ message: "Profile updated successfully", user: updatedUser });
};

// ================= SEND AADHAAR OTP =================
exports.sendAadhaarOtp = async (req, res) => {
  const { aadhaarNumber } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!/^\d{12}$/.test(aadhaarNumber)) return res.status(400).json({ message: "Invalid Aadhaar Number" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.aadhaarNumber = aadhaarNumber;
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  console.log("Dummy OTP:", otp);
  res.json({ message: "OTP sent successfully (check server console)" });
};

// ================= VERIFY OTP =================
exports.verifyAadhaarOtp = async (req, res) => {
  const { otp } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user.otp || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

  user.aadhaarVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: "Aadhaar Verified Successfully", role: user.role });
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.isLoggedIn = false;
    await user.save();
  }

  res.json({ message: "Logged out" });
};