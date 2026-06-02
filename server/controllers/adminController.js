const { Admin } = require("../models/adminModel");
const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

// AdminSignup
const adminSignup = async (req, res, next) => {
  try {
    const { name, email, password, phone, profilePic } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const isAdminExist = await Admin.findOne({ email });
    if (isAdminExist) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Admin({ name, email, password: hashedPassword, phone, profilePic });
    await newUser.save();

    const token = generateToken({ _id: newUser._id, role: "admin" });
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.json({ success: true, message: "Admin signed up successfully" });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: "Internal server error" });
  }
};

// AdminLogin
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const adminExist = await Admin.findOne({ email });
    if (!adminExist) {
      return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    const passwordsMatch = await bcrypt.compare(password, adminExist.password);
    if (!passwordsMatch) {
      return res.status(401).json({ success: false, message: "Unauthorized password" });
    }

    const token = generateToken({ _id: adminExist._id, role: adminExist.role || "admin" });
    console.log("object", token);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    
    res.status(200).json({ success: true, message: "Admin login successful" });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: "Internal server error" });
  }
};

// adminLogout
const adminLogout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.status(200).json({ success: true, message: "Admin successfully logged out" });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server Error" });
  }
};

// adminProfile
const adminProfile = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user, "======user");

    const id = req.user.id;
    const userData = await Admin.findById(id).select("-password");

    res.json({ success: true, message: "Admin data fetched", data: userData });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server Error" });
  }
};

// checkadmin
const checkadmin = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ success: false, message: "Admin not authorized" });
    }
    res.json({ success: true, message: "Admin authorized" });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server Error" });
  }
};

// adminUpdate
const updateAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, profilePic } = req.body;

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (profilePic) admin.profilePic = profilePic;

    const updatedAdmin = await admin.save();
    res.status(200).json({ success: true, message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// Userdelete
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the user being deleted is an admin
    if (userToDelete.role === "admin") {
      return res.status(403).json({ success: false, message: "Admins cannot delete other admins" });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server Error" });
  }
};

// getUserList
const getUserList = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

// checkUser
const checkUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    res.status(200).json({ success: true, message: "User is authenticated", data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

module.exports = {
  adminSignup,
  adminLogin,
  adminLogout,
  adminProfile,
  updateAdmin,
  deleteUser,
  getUserList,
  checkUser,
  checkadmin,
};