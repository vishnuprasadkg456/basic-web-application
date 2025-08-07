import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { protect } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

//Middleaware
app.use(cors());
app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

app.get('/api/user/profile', protect, (req, res) => {
  console.log("📩 /api/user/profile hit");
  res.json(req.user); // for testing
});


mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('MongoDb connected');
  app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}).catch((err)=>{
  console.error('MongoDB Connection Error',err);
})
