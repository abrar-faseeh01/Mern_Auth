// We'll create all the controller functions here and using those functions we'll create API endpoints in the routes file
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodeMailer.js';
import User from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// registration
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
    secure: process.env.NODE_ENV === 'production' , // Set to true in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict', // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  // sending welcome mail
   const mailOptions = {
    from: process.env.SENDER_EMAIL, // Use the email you used to create your Brevo account
    to: email, // recipient's email
    subject: 'Welcome to Our Service',
    text:`Welcome to our website. Your account has been created with email id: ${email}`
   }

   await transporter.sendMail(mailOptions); // this line sends the email

  res.status(201).json(new ApiResponse(201, { userId: user._id }, "User registered successfully")); 
  // not sure about user id
});

//login
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
    secure: process.env.NODE_ENV === 'production' , // Set to true in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict', // Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  
  res.status(201).json(new ApiResponse(201, { userId: user._id }, "User logged in successfully")); 
})

//logout
const logout = asyncHandler(async(req,res)=>{
    res.clearCookie('token',{  
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' , // Set to true in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict', // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
})


// verify otp
const sendVerifyOtp =asyncHandler(async (req, res) => {
    const{userId} = req.body;
    const user = await User.findById(userId);
    if(user.isAccountVerified){
        throw new ApiError(400, "Account is already verified");
    }

    // if the user is not verified, generate a new OTP
    const otp = String( Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp; // save the otp in the database
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 1 day
    await user.save();

    // now send the OTP to the user via email
    const mailOptions ={
        from: process.env.SENDER_EMAIL, // Use the email you used to create your Brevo account
        to: user.email, // recipient's email
        subject: "Account Verification OTP",
        text:`Your OTP is ${otp}. Verify your account with this OTP.`
    }

    await transporter.sendMail(mailOptions); 
    res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));

})

// get the otp and verify the user
const verifyEmail = asyncHandler(async (req, res) => {
  const {userId,otp}= req.body;

  if(!userId||!otp){
    throw new ApiError(400, "Mising details");
  }
  const user = await User.findById(userId);
  if(!user){
    throw new ApiError(400, "User does not exist");
  }
  // check if the otp matches or not
  if(user.verifyOtp === '' || user.verifyOtp!== otp){
    throw new ApiError(400, "Invalid OTP");
  }
  // check if the otp is expired or not
  if(user.verifyOtpExpireAt < Date.now()){
    throw new ApiError(400, "OTP expired");
  }
  // if the otp is valid, verify the user
  user.isAccountVerified = true;
  // reset the otp and otp expire time
  user.verifyOtp = '';
  user.verifyOtpExpireAt = 0;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, "Account verified successfully"));
})

// check user is authenticated or not
const isAuthenticated = async(req,res)=>{
   try {
    return res.status(200).json(new ApiResponse(200, { userId: req.body.userId }, "User is authenticated"));
   } catch (error) {
    throw new ApiError(500, "Internal Server Error");
    
   }
}

// password reset otp
const sendResetOtp = asyncHandler(async (req, res) => {
  const {email} = req.body;
  if(!email){
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({email});
  if(!user){
    throw new ApiError(400, "User does not exist");
  }
  // generate the reset OTP
  const otp = String( Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp; // save the otp in the database
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // OTP expires in 1 day
    await user.save();

    // now send the OTP to the user via email
    const mailOptions ={
        from: process.env.SENDER_EMAIL, 
        to: user.email, 
        subject: "Password Reset OTP",
        text:`Your OTP is ${otp}. Reset your password with this OTP.`
    }

    await transporter.sendMail(mailOptions); 
    res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
})

// reset password using the otp
const resetPassword = asyncHandler(async (req, res) => {
  const{email, otp, newPassword}= req.body;
  if(!email || !otp || !newPassword){
    throw new ApiError(400, "All fields are required");
  }
  const user= await User.findOne({email});
  if(!user){
    throw new ApiError(400, "User does not exist");
  }
  // check if the otp matches or not
  if(user.resetOtp === '' || user.resetOtp !== otp){
    throw new ApiError(400, "Invalid OTP");
  }
  // check if the otp is expired or not
  if(user.resetOtpExpireAt < Date.now()){
    throw new ApiError(400, "OTP expired");
  }
  // if the otp is valid, reset the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  // reset the otp and otp expire time
  user.resetOtp = '';
  user.resetOtpExpireAt = 0;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
})
export { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail };

