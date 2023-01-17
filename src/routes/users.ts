import express, {Request, Response} from "express";
import {Login, Register} from "../controller/user";



const router = express.Router();

router.post("/signup", Register);
router.post("/login", Login);


export default router;