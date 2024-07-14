import bcrypt from 'bcryptjs'
import User from '../Models/UserAuth'
import { Request, Response } from 'express'
import { IUser } from '../Types/UserAuthType'
import mongoose from 'mongoose'


export const Register = async (req:Request, res:Response) => {
    const {persona, email, password, firstName, lastName } = req.body;

    const hashedPassword:string = await bcrypt.hash(password, 10);

    const user: IUser =  await User.create({persona, email, password: hashedPassword, firstName, lastName})

    try {
        res.status(200).json({mssg: 'User created successfully', user })
    } catch (error:any ) {
        res.status(500).json({error: error.message})
    }
}

export const DeleteProfile = async (req:Request, res:Response) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user exists'})
    }

    const user:IUser | null = await User.findOneAndDelete({_id: id})

    if (!user) {
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
}

