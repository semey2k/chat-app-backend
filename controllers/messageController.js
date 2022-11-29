const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === to,
        fromUser: msg.users[2],
        title: msg.title.text,
        message: msg.message.text,
        created: msg.created,
      };
    });
    // console.log(projectedMessages)
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to,fromUsername, toUsername, message, title } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from , to, fromUsername, toUsername],
      title: {text: title},
      sender: from,
      created: new Date().toLocaleString(),
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
