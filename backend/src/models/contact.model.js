// backend/src/models/contact.model.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Create a compound index to ensure uniqueness
contactSchema.index({ userId: 1, contactId: 1 }, { unique: true });

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;