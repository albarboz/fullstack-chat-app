import mongoose from "mongoose"

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

        // expiresAt: {
        //     type: Date,
        //     default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        //     index: { expireAfterSeconds: 0 }, // TTL index
        // },
    },
    { timestamps: true }
)

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 })

const Message = mongoose.model('Message', messageSchema)

export default Message