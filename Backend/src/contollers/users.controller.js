import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js';
// import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword } from '../utils/authUtils.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const prisma = new PrismaClient();

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};


  
// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     // Find the user by ID
//     const user = await prisma.user.findUnique({
//       where: { id: userId }
//     });

//     if (!user) {
//       throw new ApiError(404, "User not found");
//     }

//     // Generate tokens
//     const accessToken = generateAccessToken(userId);
//     const refreshToken = generateRefreshToken(userId);

//     // Update user with refresh token
//     await prisma.user.update({
//       where: { id: userId },
//       data: { refreshToken }
//     });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.error(error); // For debugging
//     throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
//   }
// };


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


const verifyPassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    throw new Error('Both plainPassword and hashedPassword are required');
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      username: true,
      password: true // Ensure the password field is included
    }
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await verifyPassword(password,user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

  res
    .status(200)
    .cookie("accessToken", accessToken, {httpOnly:true,secure:false})
    .cookie("refreshToken", refreshToken, {httpOnly:true,secure:false})
    .json({
      user: {
        ...user,
        password: undefined // Exclude the password before sending the response
      },
      accessToken,
      refreshToken,
      message: "User logged in Successfully"
    });
});


const generateAccessAndRefreshTokens = async (userId) => {
  try {
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


const getMovieWithReviews = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const movieId = parseInt(id, 10); // Ensure ID is an integer

  // console.log('Fetching movie with ID:', movieId); // Debugging statement

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

const createReview = async (req, res) => {
  const { reviewText, rating } = req.body;
  const { movieId, userId } = req.params;

  try {
    const review = await prisma.review.create({
      data: {
        reviewText,
        rating,
        movie: {
          connect: { id: parseInt(movieId) } // Ensure movieId is an integer
        },
        user: {
          connect: { id: parseInt(userId) } // Ensure userId is an integer
        }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'An error occurred while creating the review.' });
  }
};






const updateReview = async (req, res) => {
  const { reviewText, rating } = req.body; // Extract rating from the request body
  const { id } = req.params; // Ensure 'id' is used correctly

  try {
    console.log('Updating review with ID:', id);
    console.log('Update data:', { reviewText, rating });

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { reviewText, rating }, // Update both reviewText and rating
    });

    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error); // Log the full error
    res.status(500).json({ message: "Failed to update review" });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error', error });
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



const logoutUser = asyncHandler(async (req, res) => {
  res
    .clearCookie('accessToken', {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'strict', // Adjust based on your needs
    })
    .clearCookie('refreshToken', {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'strict', // Adjust based on your needs
    })
    .status(200)
    .json({ message: 'User logged out successfully' });
});


export {
   registerUser,
   loginUser,
   generateAccessAndRefreshTokens,
   createReview,
   getMovieWithReviews,
   getCurrentUser,
   updateReview,
   deleteReview,
   getMovieWithDetails,
   logoutUser

};
