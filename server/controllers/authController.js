// We'll create all the controller functions here and using those functions we'll create API endpoints in the routes file
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const register = asyncHandler(async (req, res) => {
    //get user details from the frontend
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // saving the user with hashed password in the database
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  // User is registered. Now Generate JWT token
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Set the token in a cookie
  res.cookie('token',token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Set to true in production
    sameSite: 'strict', // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json(new ApiResponse(201, { userId: user._id }, "User registered successfully")); 
  // not sure about user id
});

const login = asyncHandler(async (req, res) => {
    const {email, password}= req.body;
    if(!email || ! password){
        throw new ApiError(400, "All fields are required");
    }
    const user= await User.findOne({ email });
    if(!user){
        throw new ApiError(400, "User does not exist");
    }

    // compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new ApiError(400, "Invalid password");
    }

    // login successful, generate JWT token
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Set the token in a cookie
  res.cookie('token',token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Set to true in production
    sameSite: 'strict', // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  
  res.status(201).json(new ApiResponse(201, { userId: user._id }, "User logged in successfully")); 
})

export {
    login, register
};

