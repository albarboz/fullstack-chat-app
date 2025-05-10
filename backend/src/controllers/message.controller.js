import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import Contact from "../models/contact.model.js"



export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user._id;
    const filter = {
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    };

    // Query sorted newest→oldest, limited to `limit`
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Flip to oldest→newest
    messages.reverse();


    const updatePromises = messages.map(msg => {
      const alreadyRead = msg.readBy?.some(rb => rb.userId.toString() === myId.toString())
      if (!alreadyRead) {
        return Message.updateOne(
          { _id: msg._id },
          { $push: { readBy: { userId: myId, readAt: new Date() } } }
        )
      }
      return null
    })

    await Promise.all(updatePromises.filter(Boolean))



    return res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal Service Error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error in getAllMessages', err);
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
        return res.status(400).json({ message: "File size too large. Max is 10MB." });
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
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.log("Error in sendMessage controller", error.message)
    res.status(500).json({ message: "Internal Service Error" })
  }
}


// This is used for the ConversationList component,
// You check your list of accepted friends, 
// fetch each one’s most recent message, 
// and assemble profile cards showing that preview for your contacts list.
export const getUsersForConvoList = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const contacts = await Contact.find({
      userId: loggedInUserId,
      status: "accepted"
    });

    // Extract contact IDs
    const contactIds = contacts.map(contact => contact.contactId);

    // Find all users who are contacts
    const contactUsers = await User.find({
      _id: { $in: contactIds }
    }).select("-password");

    // For each user, find the latest message between them and the logged-in user.
    const usersWithLastMessage = await Promise.all(
      contactUsers.map(async (user) => {
        // 1) your existing “latest message in the thread” lookup
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        }).sort({ createdAt: -1 }); // get the latest message

        // 2) NEW: aggregate the single most recent readBy entry for messages *you* sent
        const [latestRead] = await Message.aggregate([
          {
            $match: {
              senderId: loggedInUserId,
              receiverId: user._id,
              "readBy.userId": user._id
            }
          },
          { $unwind: "$readBy" },
          { $match: { "readBy.userId": user._id } },
          { $sort: { "readBy.readAt": -1 } },
          { $limit: 1 },
          { $project: { _id: 0, readAt: "$readBy.readAt" } }
        ]);

        // Convert Mongoose document to a plain object and attach lastMessage.
        return {
          ...user.toObject(),
          lastMessage: lastMessage ? lastMessage.toObject() : null,
        };
      })
    );

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.log("Error in getUsersForConvoList", error.message);
    res.status(500).json({ message: "Internal Service Error" });
  }
};
