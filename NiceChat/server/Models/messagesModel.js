const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    "content": [
      {
        "sender_id": { type: mongoose.Types.ObjectId, required: true },
        "receiver_id": { type: mongoose.Types.ObjectId, required: true },
        "sender_name": { type: String, required: true },
        "receiver_name": { type: String, required: true },
        "time": { type: Date, required: true },
        "message": { type: String, required: true },
      },
    ],
  },
  { versionKey: false }
);

const MessagesModel = mongoose.model("message", MessagesSchema, "messages");

module.exports = MessagesModel;