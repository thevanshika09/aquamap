import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {

    const { email, password, name } = req.body;

    try{
        if(!email || !password || !name) {
            throw new Error("Please provide all fields");
        }
        const userAlreadyExists = await User.findOne({email}); 

        if(userAlreadyExists){ 
           return res.status(400).json({success:false, message:"User already exists"}); 
        } 
        const hashedPassword = await bcrypt.hash(password, 10); 

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); 

        const user = new User({ 
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours 
        });

        await user.save();

        generateTokenAndSetCookie(res,user._id);

        res.status(201).json({
            success:true, 
            message:"User created successfully", 
            user:  {
                ...user._doc, 
                password: undefined
            }
        });
    }
        catch(error){
            res.status(400).json({success:false, message:error.message});
        }
}

export const login = async (req,res)=>{
    const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Verify the image isn't too large
    if (updates.profilePic && updates.profilePic.length > 2 * 1024 * 1024) { // 2MB limit
      return res.status(413).json({ success: false, message: "Image too large" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In a real app, send email with reset link
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    console.log(`Reset URL: ${resetUrl}`); // For development

    res.status(200).json({ 
      success: true, 
      message: "Reset link sent to email" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired token" 
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Password reset successful" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

