import mongoose, {Schema, Document} from "mongoose";
import { IUser } from "../Types/UserAuthType";


export interface IUserModel extends IUser, Document {};

const UserSchema = new Schema ({
    persona: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    }
})

export default mongoose.model<IUserModel>('User', UserSchema)
