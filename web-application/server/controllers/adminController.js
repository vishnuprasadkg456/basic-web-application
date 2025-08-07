import User from '../models/User.js';
import bcrypt from 'bcryptjs';


// GET /api/admin/users — Get all users with search
const getAllUsers = async (req,res)=>{
    try{
        const keyword = req.query.keyword?
        {
            name : {$regex:req.query.keyword,$options:'i'},
        } : {};

        const users = await User.find({...keyword}).select('-password');
        res.json(users);
    }catch(err){
        res.status(500).json({message:'Server error',error:err.message});
    }
};

// POST /api/admin/users — Create new user
const createUser = async (req,res)=>{
    try{
        const {name,email,password,role}=req.body;


        const exists = await User.findOne({email});

        if(exists){
            return res.status(400).json({message:'Email already in use'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });

        res.status(201).json({
            id: newUser._id,
            name:newUser.name,
            email:newUser.email,
            role:newUser.role,

        });
    }catch(err){
        res.status(500).json({message:'Server error',error:err.message});
    }
};



// PUT /api/admin/users/:id — Edit user
const updatedUser = async(req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message:'User not found'});

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        if(password){
            user.password = await bcrypt.hash(password,10);
        }

        const updatedUser = await user.save();

        res.json({
            id:updatedUser._id,
            name: updatedUser.name,
            email:updatedUser.email,
            role:updatedUser.role,
            
        });

    }catch(err){
        res.status(500).json({message:'Server error',error:err.message});
    }
};

// DELETE /api/admin/users/:id — Delete user

const deleteUser = async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({message:'User not found'});

        res.json({message:'User deleted successfully'});
    }catch(err){
        res.status(500).json({message:'Server error',error:err.message});
    }
}

export{
    getAllUsers,
    createUser,
    updatedUser,
    deleteUser
}