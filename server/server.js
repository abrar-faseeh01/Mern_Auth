import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173', 'https://mern-auth-ecru-one.vercel.app/'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}))

// API endpoints
app.get('/',(req,res)=>{
    res.send("API is  working")
})

app.use('/api/auth',authRoutes)
app.use('/api/user',userRouter)

app.use((err, req, res, next) => {
    console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});


app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}`);
})