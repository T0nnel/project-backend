import { Request, Response } from "express"
import User from '../Models/UserAuth'

export const GetProfile = async (req: Request, res:Response) => {
    const { id } = req.params

    if(!id) {
        return res.status(400).json({message: 'Id is required!'})
    }

    try {
        const user = await User.findById(id).select('persona firstName lastName email')

        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        res.status(200).json(user)
        
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
}