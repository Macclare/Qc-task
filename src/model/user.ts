import mongoose, {Schema} from "mongoose";

interface UserInstance {
    _id:string;
    name: string;
    email: string;
    password: string;
    phone: string;
    verified: boolean;
   
}

const UserSchema = new Schema<UserInstance>({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    phone: {type:String, required: true},
    verified: {type:Boolean, required: true},
    
},{
    timestamps:true
})

const User = mongoose.model<UserInstance>('User', UserSchema)

export default User;