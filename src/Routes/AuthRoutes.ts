import express, { Express } from "express";
import { Register, Login , DeleteProfile, GetProfile } from "../Controllers";
import { Schemas, ValidateSchema } from "../middlewares/Validation";

const router = express.Router()

//register a new user
router.post('/register', ValidateSchema(Schemas.user.register), Register)

//login a new user
router.post('/login', ValidateSchema(Schemas.user.login), Login)

//delete a profile
router.delete('/delete/:id', DeleteProfile)

//get a profile
router.get('/profile', GetProfile)

export  = router