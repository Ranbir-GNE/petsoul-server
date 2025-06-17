const UserModel = require("../Models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existEmail = await UserModel.findOne({ email });
  if (existEmail) {
    return res.status(400).json({ message: "Email already exist" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const user = await UserModel.create({
      username,
      email,
      password: hashPassword,
    });
    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }
    res.status(201).json({ user, message: "User Created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "23h",
    });
    if (!token) {
      return res.status(400).json({ message: "Token not generated" });
    }
    res.status(200).json({ token, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const { firstName, lastName, address, pincode, profilePicture } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        address,
        pincode,
        profilePicture,
      },
      { runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Could Not Update User" });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Could Not Delete User" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserFromToken = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token Not Found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await UserModel.find({ email, role: 'admin' });
    if (!user || user.length === 0) {
      return res.status(400).json({ message: "Admin does not exist" });
    }
    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user[0]._id }, process.env.JWT_KEY, {
      expiresIn: "23h",
    });
    if (!token) {
      return res.status(400).json({ message: "Token not generated" });
    }
    res.status(200).json({ token, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  deleteUser,
  getUserFromToken,
  adminLogin
};
