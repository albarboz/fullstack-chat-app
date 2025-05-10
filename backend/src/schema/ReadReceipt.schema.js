// readreceipt.schema.js
import { Schema } from "mongoose";

const readReceiptSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref:  "User",
    required: true,
    index: true              // single-field index
  },
  readAt: {
    type: Date,
    default: () => Date.now(),
    required: true,
    index: true              // single-field index
  }
}, { _id: false });          // disable automatic _id per subdoc

export default readReceiptSchema;