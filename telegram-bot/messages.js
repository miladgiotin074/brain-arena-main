module.exports = {
  // Error messages
  errors: {
    tokenNotSet: 'Error: BOT_TOKEN is not set in environment variables.',
    createEnvFile: 'Please create a .env file and add your BOT_TOKEN.',
    webhookHttpsRequired: 'Error: Webhook URL must use HTTPS protocol.',
    webhookSetError: 'Error setting webhook:',
    webAppDataParse: 'Error parsing web app data:',
    botError: 'Bot error:'
  },

  // Console messages
  console: {
    webhookMode: '🌐 Bot running in webhook mode',
    pollingMode: '🔄 Bot running in polling mode',
    webhookServerRunning: '🌐 Webhook server running on port',
    webhookSetSuccess: '✅ Webhook set successfully:',
    botRunning: '🤖 Telegram Bot is running...',
    webAppUrl: '📱 Web App URL:',
    webAppDataReceived: '📊 Web app data received:'
  },

  // Bot responses
  responses: {
    welcome: (firstName) => `👑 *Hello ${firstName}! Welcome to Quiz Of The Kings!*\n\n🎯 Ready to compete in online quizzes?\n🏆 Compete with your friends and show your skills!\n\n👇 Press the button below to start playing:`,
    startButton: '🚀 Start Game',
    playMessage: '🎮 Press the button below to play:'
  },
};