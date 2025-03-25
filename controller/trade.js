import { checkTrade, deleteTrade, getAllTradeId } from '../service/trade-service.js';
import { getAllTradeNow } from '../helper/get-list-trade-now.js';
import { bot } from '../index.js';
import { formatTime } from '../helper/format-time.js';
import { getListCloseTrade } from '../helper/get-time-close-and-cost-close.js';
const url = "https://futures.mexc.com/copyFutures/api/v1/trader/orders/v2?limit=1000&orderListType=ORDER&page=4&uid=";

const sendMessage = (chatId, message, topicID) => {
  if (!chatId) {
    console.error("Lỗi: chatId không hợp lệ");
    return;
  }
  
  const options = topicID ? { message_thread_id: topicID } : {};
  bot.sendMessage(chatId, message, options).catch((error) => {
    console.error("Lỗi gửi tin nhắn:", error.message);
  });
};

export async function openTrading(uid, roomId, topicID) {
  try {
    if (!roomId||!topicID) {
      console.error("Lỗi: roomId không hợp lệ");
      return;
    }
    
    const listTradeNow = await getAllTradeNow(uid);
    if (listTradeNow.length === 0) return;
    
    let time = 1;
    for (let trade of listTradeNow) {
      const newTrandings = {
        orderId: trade.orderId,
        symbol: trade.symbol,
        positionType: trade.positionType,
        openAvgPrice: trade.openAvgPrice,
        traderNickName: trade.traderNickName,
        openTime: trade.openTime,
      };

      const check = await checkTrade(newTrandings);
      if (check === "S") {
        setTimeout(() => {
          const message = `Bot: ${trade.traderNickName[0]}
Tín hiệu ✅: ${trade.positionType == 2 ? "Short" : "Long"}
Cặp giao dịch: ${trade.symbol}
Giá trung bình: ${Math.round(trade.openAvgPrice * 100000000) / 100000000} USDT
Thời gian: ${formatTime()}`;

          sendMessage(roomId, message, topicID);
        }, 1000 * 5 * (++time));
      }
    }
  } catch (error) {
    console.error("Lỗi trong openTrading:", error);
    sendMessage(roomId, `Lỗi: ${error.message}`, topicID);
  }
}

export async function closeTranding(uid, roomId, topicID) {
  try {
    if (!roomId||!topicID) {
      console.error("Lỗi: roomId không hợp lệ");
      return;
    }

    const data = await getListCloseTrade(uid);
    const listCloseTrade = data.listCloseTrade;
    const listIdTradeInDB = await getAllTradeId(data.traderNickName);

    for (let i = 0; i < listCloseTrade.length; i++) {
      if (listIdTradeInDB.includes(listCloseTrade[i].orderId)) {
        await deleteTrade(listCloseTrade[i].orderId);
        setTimeout(() => {
          const message = `Bot: ${listCloseTrade[i].traderNickName[0]}
Đã đóng tín hiệu ❌: ${listCloseTrade[i].positionType == 2 ? " Short" : " Long"}
Cặp giao dịch: ${listCloseTrade[i].symbol}
Giá mở : ${Math.round(listCloseTrade[i].openAvgPrice * 100000000) / 100000000} USDT
Giá đóng : ${Math.round(listCloseTrade[i].closeAvgPrice * 100000000) / 100000000} USDT
Thời gian đóng: ${formatTime()}`;

          sendMessage(roomId, message, topicID);
        }, i * 5000);
      }
    }
  } catch (error) {
    console.error("Lỗi trong closeTranding:", error);
    sendMessage(roomId, `Lỗi: ${error.message}`, topicID);
  }
}
