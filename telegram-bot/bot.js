const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const messages = require('./messages');
require('dotenv').config();

// Bot configuration from environment variables
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const botToken = token;
const webAppUrl = process.env.WEB_APP_URL || 'http://localhost:3000';
const webhookBaseUrl = process.env.WEBHOOK_URL;
const webhookUrl = webhookBaseUrl ? `${webhookBaseUrl}/${botToken}` : null;
const port = process.env.PORT || 3001;

// Validate required environment variables
if (!token || token === 'YOUR_BOT_TOKEN') {
  console.error(messages.errors.tokenNotSet);
  console.error(messages.errors.createEnvFile);
  process.exit(1);
}

// Initialize bot with appropriate mode
let bot;
if (webhookUrl && process.env.NODE_ENV === 'production') {
  // Production mode with webhook
  bot = new TelegramBot(token, {webHook: true});
  console.log(messages.console.webhookMode);
} else {
  // Development mode with polling
  bot = new TelegramBot(token, {polling: true});
  console.log(messages.console.pollingMode);
}

// Setup Express server for webhook in production
if (webhookUrl && process.env.NODE_ENV === 'production') {
  const app = express();
  app.use(express.json());
  
  // Webhook endpoint
  app.post(`/${botToken}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`${messages.console.webhookServerRunning} ${port}`);
    setupWebhook();
  });
}

// Function to setup webhook automatically
async function setupWebhook() {
  try {
    const url = new URL(webhookUrl);
    if (url.protocol !== 'https:') {
      console.error(messages.errors.webhookHttpsRequired);
      return;
    }
    
    const result = await bot.setWebHook(webhookUrl);
    if (result) {
      console.log(`${messages.console.webhookSetSuccess} ${webhookUrl}`);
    } else {
      console.error(messages.errors.webhookSetupFailed);
    }
  } catch (error) {
    console.error(messages.errors.webhookSetupError, error.message);
  }
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'User';
  
  const welcomeMessage = messages.responses.welcome(firstName);
  
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        {
          text: messages.responses.startButton,
          web_app: { url: webAppUrl }
        }
      ]]
    }
  };
  
  bot.sendMessage(chatId, welcomeMessage, options);
});

// Handle any other messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Skip if it's a /start command (already handled above)
  if (text && text.startsWith('/start')) {
    return;
  }
  
  // For any other message, show the web app button
  const message = messages.responses.playMessage;
  
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        {
          text: messages.responses.startButton,
          web_app: { url: webAppUrl }
        }
      ]]
    }
  };
  
  bot.sendMessage(chatId, message, options);
});
// Error handling
bot.on('error', (error) => {
  console.error(messages.errors.botError, error);
});

console.log(messages.console.botRunning);
console.log(messages.console.webAppUrl, webAppUrl);