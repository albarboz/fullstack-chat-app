import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    // Search for users by name or email, excluding the current user
    const users = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Not the current user
        {
          $or: [
            { fullName: { $regex: query, $options: "i" } }, // Case insensitive search
            { email: { $regex: query, $options: "i" } }
          ]
        }
      ]
    }).select("-password").limit(10); // Limit to 10 results
    
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchUsers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};