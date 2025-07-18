const express = require("express");
const {userAuth} = require("../middlewares/auth");

const requestsRouter = express.Router();

requestsRouter.post("/sendConnectionRequest", userAuth, async function (req, res) {
  // This route is for sending a connection request to another user
  try {
    const { recipientId } = req.body; // recipientId is the userId of the user to whom you want to send the connection request

    if (!recipientId) {
      return res.status(400).send("Recipient ID is required");
    }

    // Find the recipient user
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).send("Recipient not found");
    }

    // Here you can implement logic to send a connection request
    // For example, you can add the recipient's ID to the sender's list of connection requests
    const sender = req.user; // req.user is set by the userAuth middleware
    if (!sender) {
      return res.status(404).send("Sender not found");
    }
    // Assuming sender has a field called connectionRequests which is an array of userIds
    if (!sender.connectionRequests) {
      sender.connectionRequests = [];
    }
    if (sender.connectionRequests.includes(recipientId)) {
      return res.status(400).send("Connection request already sent");
    }
    sender.connectionRequests.push(recipientId);
    await sender.save(); // Save the updated sender user
    // Optionally, you can also notify the recipient about the connection request
    // For example, you can send an email or a notification
    // res.status(200).send("Connection request sent successfully");
    // For now, just send a success response
    console.log(`Connection request sent from ${sender._id} to ${recipient._id}`);
    // Send a success response

    res.status(200).send("Connection request sent successfully");
  } catch (error) {
    console.error("Connection request error:", error);
    res.status(400).send("ERROR: " + error.message);
  }
});


module.exports = requestsRouter;