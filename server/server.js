import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';


const app = express();
const port = process.env.PORT || 4000;
connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}))

// API endpoints
app.get('/',(req,res)=>{
    res.send("API is  working")
})

app.use('/api/auth',authRoutes)

app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}`);
})