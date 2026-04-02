const express = require('express');
const router = express.Router();
const Message = require('../schemas/messages');
const { checkLogin } = require('../utils/authHandler');

router.get('/:userID', checkLogin, async (req, res) => {
  const currentUser = req.user._id;
  const userID = req.params.userID;
  try {
    const messages = await Message.find({
      $or: [
        { from: currentUser, to: userID },
        { from: userID, to: currentUser }
      ]
    }).sort({ createdAt: 1 }); // .populate('from', 'username').populate('to', 'username')
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', checkLogin, async (req, res) => {
  const { to, type, text } = req.body;
  const from = req.user._id;
  try {
    const message = new Message({
      from,
      to,
      messageContent: { type, text }
    });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', checkLogin, async (req, res) => {
  const currentUser = req.user._id;
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: currentUser },
            { to: currentUser }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$from', currentUser] },
              then: '$to',
              else: '$from'
            }
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);
    // const populatedMessages = await Message.populate(messages.map(m => m.lastMessage), [
    //   { path: 'from', select: 'username' },
    //   { path: 'to', select: 'username' }
    // ]);
    res.json(messages.map(m => m.lastMessage));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;