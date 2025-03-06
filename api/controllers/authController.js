import User from "../models/user-model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_SECRET;

export const loginHandler = async (req, res) => {
  const { email, password } = req.value.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const token = generateToken(user);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: accessToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const generateAccessToken = (user) => {
  try {
    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
        algorithm: "HS256",
      }
    );
  } catch (error) {
    throw new Error(`Error generating token: ${error.message}`);
  }
};

const generateRefreshToken = (user) => {
  try {
    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      REFRESH_TOKEN,
      {
        expiresIn: "7d",
      }
    );
  } catch (error) {
    throw new Error(`Error generating refreshToken: ${error.message}`);
  }
};

export const refreshTokenHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized - No Refresh Token" });
  }

  try {
    // Verify Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    console.log("Decoded token:", decoded);

    const user = await User.findByPk(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set new refresh  and access tokens in HttpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

   
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    return res
      .status(403)
      .json({ message: "Invalid or Expired Refresh Token" });
  }
};

export const logoutHandler = async (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
