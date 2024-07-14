import { Express, Request, Response } from "express";
import authRoutes from "./AuthRoutes";

export function registerRoutes(app:Express) {
    app.get('/agri', (req:Request, res:Response) => {
    res.status(200).json("Server is running")
   })

  app.use('/api', authRoutes)

}