import express, { Request, Response } from "express";
import UserInstance from "../model/user";
import {
    registerSchema, option, GenerateSalt, GeneratePassword, loginSchema, generateToken
} from "../utils/utility";
import bcrypt from "bcrypt";

/**=====================Register======================**/
export const Register = async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            confirm_password
        } = req.body;

        const validateResult = registerSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        // Generate salt
        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);
        const User = await UserInstance.findOne({ email })


            //Create User
            if (!User) {
                let user = await UserInstance.create({
                    name,
                    email,
                    phone,
                    password: userPassword,
                    salt,
                    verified: true,
                    role: 'user'
                })

                // check if user exists
                const User = await UserInstance.findOne({email})

                return res.status(201).json({
                    message: "User created successfully",
                    User,
                })
            }
            return res.status(400).json({
                message: "User already exists"
            })


    } catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/signup"
        })
    }
}

/**=====================Login======================**/
export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const validateResult = loginSchema.validate(req.body, option)
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        const user = await UserInstance.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            })
        }
        if (user) {
            const validate = await bcrypt.compare(password, user.password)
            if (validate) {
                const token = await generateToken(`${user._id}`)
                res.cookie(`token`, token)
                return res.status(200).json({
                    message: "Login Successful",
                    email: user.email,
                    verified: user.verified
                })
            }
        }
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    } catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/login"
        })
    }
}