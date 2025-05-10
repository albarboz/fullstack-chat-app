import mongoose from "mongoose"
import readReceiptSchema from "../schema/ReadReceipt.schema.js"

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        text: {
            type: String,

        },

        image: {
            type: String,
        },

        readBy: [readReceiptSchema]

    }, { timestamps: true }
)

// Compound for conversation + time
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// Multikey on subdocument fields
messageSchema.index({ "readBy.userId": 1, "readBy.readAt": -1 });

const Message = mongoose.model('Message', messageSchema)

export default Message