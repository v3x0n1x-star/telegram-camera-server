const express = require("express");
const multer = require("multer");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const upload = multer({ dest: "uploads/" });

// Bot token will be added in Render as environment variable
const token = process.env.BOT_TOKEN;

if (!token) {
  console.log("BOT_TOKEN not found!");
}

const bot = new TelegramBot(token);

// Allow JSON data
app.use(express.json());

// Receive photo from website
app.post("/upload", upload.single("photo"), (req, res) => {
  const chatId = req.body.chatId;

  if (!chatId) {
    return res.status(400).send("chatId missing");
  }

  bot.sendPhoto(chatId, req.file.path)
    .then(() => {
      res.send("Photo sent successfully!");
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    });
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is working.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
