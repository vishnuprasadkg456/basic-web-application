import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true,'Name is required'],
            trim : true,
        },
        email : {
            type : String,
            required : [true,'Email is required'],
            unique : true,
            lowercase:true,
            trim : true,
        },
        password : {
            type : String,
            required : [true,'Password is required'],

        },
        role : {
            type : String,
            enum : ['user','admin'],
            default : 'user'
        },

        profileImage : {
            type : String,
            default:'',
        },

    },
    {
        timestamps : true,
    }
);


const User = mongoose.model('User',userSchema);

export default User;