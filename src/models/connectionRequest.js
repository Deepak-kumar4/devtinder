// here connection request model
const mongoose = require("mongoose");
const { Schema } = mongoose;
const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message:
          "Status must be either ignored, interested, accepted, or rejected",
      },
    },
  },
  {
    timestamps: true, // this will add createdAt and updatedAt fields to the schema
  }
);

// create a index for the userId
// this will fast the query
connectionRequestSchema.index({fromUserId: 1, toUserId:1});


const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
