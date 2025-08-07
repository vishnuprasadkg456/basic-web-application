import jwt from 'jsonwebtoken';
import User from '../models/User.js';




const protect = async (req, res, next) => {
  let token;

  console.log("🔐 Checking Authorization header...");

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];

    if (!token || token === "undefined") {
      console.log("❌ Token missing or undefined");
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.log("❌ JWT verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    console.log("❌ No Authorization header provided");
    return res.status(401).json({ message: "No token provided" });
  }
};



const authorizeRoles = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:'Acess denied : Insufficient role'});
        }
        next();
    }
}

export {
    protect,
    authorizeRoles
}