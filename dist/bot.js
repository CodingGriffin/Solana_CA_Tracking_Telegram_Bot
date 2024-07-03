"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const telegram_scraper_1 = require("telegram-scraper");
// const TelegramScraper = require('telegram-scraper');
// const config = {
//   api_id: 'YOUR_API_ID',
//   api_hash: 'YOUR_API_HASH',
//   phone_number: 'YOUR_PHONE_NUMBER'
// };
// Load environment variables
dotenv.config();
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error("Bot token is not set in .env");
    process.exit(1);
}
console.log("Bot token:", token);
// Create a new Telegram bot using polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });
// const scraper = new TelegramScraper(config);
// Session state for each chat
const sessions = {};
// Define the inline keyboard layout for interaction
// const options = {
//   reply_markup: {
//     inline_keyboard: [
//       [{ text: "🛒 Buy", callback_data: "buy" }, { text: "📈 Sell", callback_data: "sell" }],
//       [{ text: "💼 Help", callback_data: "help" }, { text: "📬 Channel", url: "https://t.me/Maestrosdegen" }]
//     ],
//   },
// };
// const selectedBuyOptions = {
//   reply_markup: {
//     inline_keyboard: [
//       [{ text: "🛒 Manual Buy", callback_data: "manual_buy" }],
//       [{ text: "🚀 Auto Buy", callback_data: "auto_buy" }]
//     ],
//   },
// };
const options = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "⚔ Scrap", callback_data: "scraping" }, { text: "📈 Sell", callback_data: "sell" }],
            [{ text: "Enter Text", callback_data: "enter_channel" }]
        ],
    },
};
bot.onText(/\/start/, (msg) => {
    // console.log('start')
    const chatId = msg.chat.id;
    const welcomeMessage = "🍄 Welcome to my EarningMachine!\n\n`AAHIHyQ2snhl1PmJCyjNc5ESACrd6U-0CRk                                   `\n\n`https://t.me/toptalent_bot`\n\n 🥞 Please choose a category below:";
    bot.sendMessage(chatId, welcomeMessage, options);
});
function extractBetween(str, startDelimiter) {
    const start = str.indexOf(startDelimiter);
    if (start !== -1) {
        return str.substring(start + startDelimiter.length + 2, start + startDelimiter.length + 46);
    }
    return null;
}
// function extractBetween(str: string, startDelimiter: string, endDelimiter: string): string | null {
//   const start: number = str.indexOf(startDelimiter);
//   const end: number = str.indexOf(endDelimiter, start + startDelimiter.length);
//   if (start !== -1 && end !== -1) {
//       return str.substring(start + startDelimiter.length, end);
//   }
//   return null;
// }
bot.on("callback_query", async (callbackQuery) => {
    const message = callbackQuery.message;
    const category = callbackQuery.data;
    const chatId = message.chat.id;
    if (!sessions[chatId]) {
        sessions[chatId] = { waitingForAmount: false, waitingForTokenAddress: false };
    }
    if (category === "scraping") {
        // await scraper.connect();
        // console.log('Connected to Telegram API');
        // const chatId = 'telegram_group_or_channel'; // Replace with your actual group/channel
        // const limit = 100;
        // console.log(`Fetching messages from ${chatId} with limit ${limit}`);
        // const messages = await scraper.getMessages(chatId, limit);
        // console.log('Messages fetched successfully');
        let messages = await (0, telegram_scraper_1.telegram_scraper)('solanatokensnew');
        if (messages == 'Unknown telegram channel') {
            bot.sendMessage(chatId, "☹Unknown Telegram Channel☹     \n\n   😁Please Enter Correct One!     \n\n⚱️  For example: Telegram                      ");
        }
        console.log('telegram scraper result ===============> ', messages);
        const message_json = JSON.parse(messages);
        message_json.map((one) => console.log("resutl=======>", extractBetween(one.message_text, "Photon")));
        // console.log('telegram scraper result ===============> ', message_json);
        // const extracted: string | null = extractBetween(messages, "Photon", "message_photo");
        // console.log(extracted); // Output: "brown fox"
    }
    if (category == "enter_channel") {
        bot.sendMessage(message.chat.id, 'Please enter the Channel Name you want');
        bot.on('message', (msg) => {
            if (msg.text && msg.text !== '/start') {
                bot.sendMessage(message.chat.id, `You entered: ${msg.text}`);
            }
        });
    }
});
// bot.on("callback_query", async (callbackQuery:any) => {
//   const message = callbackQuery.message;
//   const category = callbackQuery.data;
//   const chatId = message.chat.id;
//   if (!sessions[chatId]) {
//     sessions[chatId] = { waitingForAmount: false, waitingForTokenAddress: false };
//   }
//   if (category === "buy") {
//     let result = await telegram_scraper('OBOX')
//     console.log('telegram scraper result ===============> ', result)
//     bot.sendMessage(chatId, "🏆 Choose your buy method:                  ", selectedBuyOptions);
//   } else if (category === "manual_buy") {
//     sessions[chatId].waitingForAmount = true;
//     bot.sendMessage(chatId, "✍ Input the amount you want to buy ...  (sol)     \n⚱️  For example: 1.25                      ");
//   } else if (category === "auto_buy") {
//     bot.sendMessage(chatId, "✍ Auto buy is not implemented yet.");
//   }
// });
// bot.on("message", (msg:any) => {
//   const chatId = msg.chat.id;
//   const session = sessions[chatId];
//   if (!session) return; // Ignore messages if session isn't initialized
//   if (session.waitingForTokenAddress) {
//     const tokenAddress = msg.text.trim();
//     if (tokenAddress) {
//       console.log("Token address:", tokenAddress);
//       session.tokenAddress = tokenAddress;
//       session.waitingForTokenAddress = false;      
//       bot.sendMessage(chatId, `👌 Success! Ready for swap ...                                                 \n\n💰 Amount: ${session.amount.toFixed(6)} SOL           \n🤝 Token Address: ${tokenAddress}`);
//       console.log("----***--SwapConfig---***---", swapConfig(tokenAddress, session.amount));
//       delete sessions[chatId]; // Clear session after completion
//     }
//   } else if (session.waitingForAmount) {
//     const amount = parseFloat(msg.text);
//     if (!isNaN(amount)) {
//       session.amount = amount;
//       session.waitingForAmount = false;
//       session.waitingForTokenAddress = true;
//       bot.sendMessage(chatId, "🧧 Input the token address you want to buy ...  (sol)     \n\n⚱️  For example: 7NgbAAMf3ozg4NG3Ynt2de5TA2afMZZkfkGpEpC2mXYu      ");
//     } else {
//       bot.sendMessage(chatId, "Invalid amount. Please enter a valid number.");
//     }
//   }
// });
