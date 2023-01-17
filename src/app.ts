import express from 'express';
import cookieParser from 'cookie-parser';
import logger  from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import path from 'path';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(),'./public')))


require('dotenv').config({ path: path.resolve(__dirname, './.env') });

mongoose.connect(process.env.DATABASE_URL!, ()=>{
    console.log("Database connected successfully")
})

app.use('/users', userRouter)

const Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
    }
);

export default app;