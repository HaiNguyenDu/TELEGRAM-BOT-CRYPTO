import { closeTranding, openTrading } from "./trade.js";

var roomId = -4545085133;
var topicID;
const listNumBer = [];
const listTrader = {
  "A": 22247145,
  "B": 86334842,
  "C": 17780774,
};
const sendMessage = (chatId, message,bot) => {
  const options = topicID ? { message_thread_id: topicID } : {};
  bot.sendMessage(chatId, message, options);
};


export const botCommands = (bot) => {
  bot.onText(/\/xxxhelp/, (msg) => {
    const chatId = msg.chat.id;
    const message = `/xxxchangeTrader idTraderOld idTraderNew nameTraderNew
This order has the effect of changing traders
/xxxGetTopicId 
This order to get Topic Id 

/xxxSetUpTopicId
This order to set up Topic Group 

/xxxlistTrader 
This order has the effect of echo List Trader

/xxxchangeGroupId id
This order has the effect of change Group Id

/xxxgetGroupId
This order has the effect of get Group Id

/xxxtestGroupId message
This order has the effect of test bot in Group

/xxxaddTrader traderNickName uid
This order has the effect of add Trader copy

/xxxremoveTrader traderNickName
This order has the effect of remove Trader copy

/xxxSetUpTopicId
This order has the effect of setting the Topic Id`;

    sendMessage(chatId, message, bot);
  });

  bot.onText(/\/xxxSetUpTopicId/, (msg) => {
    const chatId = msg.chat.id;
    roomId = msg.chat.id
    if (!msg.message_thread_id) {
      sendMessage(chatId, "This command must be used inside a topic.");
      return;
    }
    topicID = msg.message_thread_id;
    sendMessage(chatId, `Topic ID has been set to ${topicID}`, bot);
  });

  bot.onText(/\/xxxaddTrader (.+) (\S+)/, (msg, match) => {
    const traderName = match[1];
    const uid = match[2];
    listTrader[traderName] = uid;

    setTimeout(() => {
      setInterval(() => closeTranding(listTrader[traderName], roomId,topicID), 100000);
    }, 5000);
    setInterval(() => openTrading(listTrader[traderName], roomId,topicID), 100000);

    sendMessage(roomId, `Add Trader ${traderName}:${uid} success`, bot);
  });

  bot.onText(/\/xxxremoveTrader (.+)/, (msg, match) => {
    const traderName = match[1];
    if (!listTrader[traderName]) {
      return sendMessage(roomId, "Trader is not exist", bot);
    } else {
      delete listTrader[traderName];
      sendMessage(roomId, `Remove Trader ${traderName} success`, bot);
    }
  });

  bot.onText(/\/xxxtestGroupId (.+)/, (msg, match) => {
    const resp = match[1];
    sendMessage(roomId, resp, bot);
  });

  bot.onText(/\/xxxchangeTrader (\S+) (\S+) (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!match[1] || !match[2] || !match[3]) {
      sendMessage(
        chatId,
        "Vui lòng nhập đúng dữ liệu theo form: IdTraderOld IdTraderNew NameTraderNew",
        bot
      );
      return;
    }

    for (let trader in listTrader) {
      if (listTrader[trader] == match[1]) {
        delete listTrader[trader];
        listTrader[match[3]] = match[2];
        sendMessage(chatId, "Thay đổi thành công", bot);
        return;
      }
    }
    sendMessage(chatId, "Id không tồn tại", bot);
  });

  bot.onText(/\/xxxlistTrader/, (msg) => {
    const chatId = msg.chat.id;
    let result = "";
    for (let trader in listTrader) {
      result += `${trader}:${listTrader[trader]}\n`;
    }

    sendMessage(chatId, result, bot);
  });

  bot.onText(/\/xxxchangeGroupId (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    roomId = match[1];
    sendMessage(chatId, "Thay đổi ID Room thành công", bot);
  });

  bot.onText(/\/xxxgetTopicId/, (msg) => {
    const chatId = msg.chat.id;
    sendMessage(chatId, `Group ID: ${roomId}`, bot);
  });

  let i = 0;
  for (let trader in listTrader) {
    setTimeout(() => {
      setTimeout(() => {
        setInterval(() => closeTranding(listTrader[trader], roomId,topicID), 100000);
      }, 5000);
      setInterval(() => openTrading(listTrader[trader], roomId,topicID), 100000);
    }, 1000 * i++);
  }
};
