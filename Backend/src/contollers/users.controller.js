import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword } from '../utils/authUtils.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate tokens
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Update user with refresh token
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error); // For debugging
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};


const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password} = req.body;


  


  if (!fullName, !email, !username, !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username.toLowerCase() },
        { email }
      ]
    }
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      username: username.toLowerCase(),
      password: hashedPassword 
    }
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Exclude password 
  const createdUser = {
    ...user,
    password: undefined
  };

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  

  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required");
  }

  // Find user by email or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    }
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);


  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate tokens
 
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id); // Ensure this function is implemented


  console.log(user.id)
  


  // Create a response object without sensitive information
  const loggedInUser = {
    ...user,
    password: undefined,
    refreshToken: undefined
  };

  // Send response
  const options = {

    httpOnly : true ,
    secure : true 
   
    }
   
   
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
   
       new ApiResponse(
    
      200,
      {
       user : loggedInUser , accessToken , refreshToken
     
     },
   
     "User logged in Successfully"
   
       )
   
     )   
   
});



const getMovieWithReviews = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const movieId = parseInt(id, 10); // Ensure ID is an integer

  console.log('Fetching movie with ID:', movieId); // Debugging statement

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ movie, reviews: movie.reviews }); // Include reviews separately if needed
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller to create a review for a movie
const createReview = async (req, res) => {
  // const { id } = req.params;
  const { reviewText, rating } = req.body;

  // Extract token from headers and verify it
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // const decoded = verifyToken(token); // Use your token verification method
    // const userId = decoded.id;

    // Create the review
    const review = await prisma.review.create({
      data: {
        // movieId: parseInt(id),
        reviewText,
        rating
      }
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateReview = async (req, res) => {
  const { reviewText, rating } = req.body;
  const { reviewId } = req.params;

  try {
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: { reviewText, rating },
    });
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Failed to update review" });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    await prisma.review.delete({
      where: { id: parseInt(reviewId) },
    });
    res.status(204).send(); // No content to return
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};


const getCurrentUser = asyncHandler(async(req,res)=>{
 
   
  
   console.log(req.user)
  return res.status(200).json(new ApiResponse(200,req.user,"current user fetched successfully"))


}) 



const getMovieWithDetails = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany(); // Retrieve all movies
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
   registerUser,
   loginUser,
   generateAccessAndRefreshTokens,
   createReview,
   getMovieWithReviews,
   getCurrentUser,
   updateReview,
   deleteReview,
   getMovieWithDetails

};
