const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/balcklist.model");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/email.service");

/**
 * @name register
 * @description register a new user, {username, email, password}
 * @access Public
 */
async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please Provide username, email, password",
    });
  }

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "Account Already Exists.",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name login
 * @description login a user, {email , password}
 * @access Public
 */
async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({
    message: "User loggedIn successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logout
 * @description clear token from user and add the token in blacklist
 * @access public
 */
async function logout(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "User logged out successfully",
  });
}

/**
 * @name getMe
 * @description get the current logged in user details
 * @access private
 */
async function getMe(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch user details",
    });
  }
}

/**
 * @name forgotPassword
 * @description Send a secure password reset link
 * @access Public
 */

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Please provide your email address.",
      });
    }
    const user = await userModel.findOne({ email: email.trim() });

    if (!user) {
      return res.status(200).json({
        message: "A reset link has been sent to the email.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const frontendURL = process.env.FRONTEND_URL;

    if (!frontendURL) {
      throw new Error("FRONTEND_URL is not configured.");
    }

    const resetURL = `${frontendURL.replace(/\/$/, "")}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetURL);
    } catch (emailError) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      message: "A reset link has been sent to the email.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Unable to process your request. Please try again later.",
    });
  }
}

/**
 * @name resetPassword
 * @description Reset user password using a valid reset token
 * @access Public
 */
async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || typeof password != "string" || !password) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //Find user with vaid, unexpired reset token
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset link.",
      });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);

    // Invalidate the reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Unable to reset password. Please try again later.",
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};
