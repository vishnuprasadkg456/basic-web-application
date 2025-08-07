import User from '../models/User.js';
import bcrypt from 'bcryptjs';


const getUserprofile = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(404).json({message : 'user not found'});
        res.json(user);
    }catch(err){
        res.status(500).json({message:'Server error',errror : err.message});
    }
};
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update password
    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      user.password = hashed;
    }

    //  Handle uploaded file
    if (req.file && req.file.path) {
      user.profileImage = req.file.path; // or use req.file.filename based on multer config
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export {
    getUserprofile,
    updateUserProfile
}