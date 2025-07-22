const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const Request = require("../models/connectionRequest");

const requestsRouter = express.Router();

const User = require("../models/user"); // Import User model if not already

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async function (req, res) {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //  Validate status
      const validStatuses = ["interested", "ignored"];
      if (!validStatuses.includes(status)) {
        return res.status(400).send({ error: "Invalid status provided" });
      }

      // Prevent sending request to self
      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).send({ error: "You cannot send a request to yourself" });
      }

      // Check if `toUserId` exists
      const toUserExists = await User.findById(toUserId);
      if (!toUserExists) {
        return res.status(404).send({ error: "Target user not found" });
      }

      // Check for existing requests in either direction
      // here we will create a compound index // search 
      const existingRequest = await Request.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      });
      if (existingRequest) {
        return res.status(400).send({ error: "Request already exists" });
      }

      // Create new request
      const connectionRequest = await Request.create({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(201).send({
        message: req.user.firstName +" is "+ status + " in " + toUserId,
        data,
      });

    } catch (error) {
      console.error("Error sending request:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);




module.exports = requestsRouter;
