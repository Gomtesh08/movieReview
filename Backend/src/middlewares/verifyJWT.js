import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token received:", token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "Unauthorized request" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.log("Token verification failed:", err);
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    if (!decodedToken?.id) {
      console.log("Invalid token structure");
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: { id: true, email: true, username: true }
    });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    req.user = user;
    console.log("Authenticated user:", req.user);

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: error?.message || "Invalid access token" });
  }
});

export default verifyJWT;
