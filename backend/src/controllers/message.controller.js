import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      // Fetch all users except the logged-in one.
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
      // For each user, find the latest message between them and the logged-in user.
      const usersWithLastMessage = await Promise.all(
        filteredUsers.map(async (user) => {
          const lastMessage = await Message.findOne({
            $or: [
              { senderId: loggedInUserId, receiverId: user._id },
              { senderId: user._id, receiverId: loggedInUserId },
            ],
          }).sort({ createdAt: -1 }); // get the latest message
  
          // Convert Mongoose document to a plain object and attach lastMessage.
          return {
            ...user.toObject(),
            lastMessage: lastMessage ? lastMessage.toObject() : null,
          };
        })
      );
  
      res.status(200).json(usersWithLastMessage);
    } catch (error) {
      console.log("Error in getUsersForSidebar", error.message);
      res.status(500).json({ message: "Internal Service Error" });
    }
  };

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller", error.message)
        res.status(500).json({ message: "Internal Service Error" })

    }
}

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages." });
  }
}


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let imageUrl
        if (image) {
            // Calculate file size from base64 (rough estimate)
            const imageSizeInBytes = Buffer.byteLength(image, 'base64');
            const maxSize = 10485760; // 10MB in bytes

            if (imageSizeInBytes > maxSize) {
                return res.status(400).json({ message: "File size too large. Maximum allowed is 10MB." });
            }

            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message)
        res.status(500).json({ message: "Internal Service Error" })
    }
}
