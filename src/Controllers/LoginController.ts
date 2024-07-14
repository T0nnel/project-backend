import bcrypt from 'bcryptjs'
import User, { IUserModel } from '../Models/UserAuth'
import { Request, Response } from 'express'



export const Login = async (req:Request, res:Response) => {
    const {email, password} = req.body;

    try {
      const user: IUserModel | null = await User.findOne({email});

      if (!user) {
         throw new Error('Invalid Email or Password')
      }
  
      const isValid: boolean = await bcrypt.compare(password, user.password)
      
      if (!isValid) {
         throw new Error('Invalid Email or Password')
      }
  
      //return persona
      const {persona, firstName, lastName, _id } = user
      res.status(200).json({persona, firstName, lastName, userId:_id,  mssg:  'User logged in successfully'});
    } catch (error: any) {
      console.error(error.message)
      res.status(401).json({error: error.message})
    }
    
   }
