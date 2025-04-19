// backend/src/controllers/contact.controller.js
import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";

export const sendContactRequest = async (req, res) => {
  try {
    const { id: contactId } = req.params;
    const userId = req.user._id;

    // Don't allow adding yourself
    if (userId.toString() === contactId) {
      return res.status(400).json({ message: "You cannot add yourself as a contact" });
    }

    // Check if contact exists
    const contactExists = await User.findById(contactId);
    if (!contactExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if request already exists
    const existingContact = await Contact.findOne({
      $or: [
        { userId, contactId },
        { userId: contactId, contactId: userId }
      ]
    });

    if (existingContact) {
      return res.status(400).json({ message: "Contact request already exists" });
    }

    // Create new contact request
    const newContact = new Contact({
      userId,
      contactId,
      status: "pending"
    });

    await newContact.save();

    res.status(201).json({ message: "Contact request sent successfully" });
  } catch (error) {
    console.log("Error in sendContactRequest:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptContactRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const userId = req.user._id;

    // Find the contact request
    const contactRequest = await Contact.findOne({
      _id: requestId,
      contactId: userId,
      status: "pending"
    });

    if (!contactRequest) {
      return res.status(404).json({ message: "Contact request not found" });
    }

    // Update status to accepted
    contactRequest.status = "accepted";
    await contactRequest.save();

    // Create a reciprocal contact (so both users have each other in contacts)
    const reciprocalContact = new Contact({
      userId: userId,
      contactId: contactRequest.userId,
      status: "accepted"
    });

    await reciprocalContact.save();

    res.status(200).json({ message: "Contact request accepted" });
  } catch (error) {
    console.log("Error in acceptContactRequest:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rejectContactRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const userId = req.user._id;

    // Find and delete the request
    const deletedRequest = await Contact.findOneAndDelete({
      _id: requestId,
      contactId: userId,
      status: "pending"
    });

    if (!deletedRequest) {
      return res.status(404).json({ message: "Contact request not found" });
    }

    res.status(200).json({ message: "Contact request rejected" });
  } catch (error) {
    console.log("Error in rejectContactRequest:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeContact = async (req, res) => {
  try {
    const { id: contactId } = req.params;
    const userId = req.user._id;

    // Remove both sides of the contact relationship
    await Contact.deleteMany({
      $or: [
        { userId, contactId },
        { userId: contactId, contactId: userId }
      ]
    });

    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    console.log("Error in removeContact:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all accepted contacts
    const contacts = await Contact.find({
      userId,
      status: "accepted"
    }).populate("contactId", "-password");

    // Format the response
    const formattedContacts = contacts.map(contact => ({
      _id: contact.contactId._id,
      email: contact.contactId.email,
      fullName: contact.contactId.fullName,
      profilePic: contact.contactId.profilePic
    }));

    res.status(200).json(formattedContacts);
  } catch (error) {
    console.log("Error in getContacts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContactRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all pending contact requests where this user is the recipient
    const requests = await Contact.find({
      contactId: userId,
      status: "pending"
    }).populate("userId", "-password");

    // Format the response
    const formattedRequests = requests.map(request => ({
      requestId: request._id,
      user: {
        _id: request.userId._id,
        email: request.userId.email,
        fullName: request.userId.fullName,
        profilePic: request.userId.profilePic
      }
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.log("Error in getContactRequests:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};