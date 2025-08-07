import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId,role)=>{
    return jwt.sign({id:userId,role},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN || '1h',
    });
};

export const registerUser = async (req,res)=>{
    const {name,email,password} = req.body;

    try{
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message:'User already exists'});

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        const token = generateToken(user._id,user.role);
        res.status(201).json({
            token,
            user : {
                id:user._id,
                name : user.name,
                email : user.email,
                role:user.role,
                profileImage : user.profileImage,
            },
        });
    }catch(err){
        res.status(500).json({message : 'Server error',error : err.message});
    }
}

export const loginUser = async (req,res)=>{
    const {email,password,role}=req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(400).json({message:'Invalid Credentials '});

        if(role && role === 'admin' && user.role !== 'admin'){
            return res.status(403).json({message:'Access denied (not admin)'});
        }

        const token = generateToken(user._id,user.role);

        res.json({
            token,
            user : {
                id: user._id,
                name : user.name,
                email : user.email,
                role:user.role,
                profileImage : user.profileImage,
            }
        })



    }catch(err){
        res.status(500).json({message:'Server error',error:err.message});
    }
};