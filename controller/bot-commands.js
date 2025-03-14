import { closeTranding, openTrading } from "./trade.js";

var roomId =-4545085133;
const listNumBer = []
const listTrader ={
  "A":22247145,
  "B":86334842,
  "C":17780774,
}



export const botCommands =(bot)=>{
  bot.onText(/\/xxxhelp/, (msg, match) => {
    const chatId = msg.chat.id;
    const message =`/xxxchangeTrader idTraderOld idTraderNew nameTraderNew
This order has the effect of changing traders

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
`

    
    bot.sendMessage(chatId, message);
  });   
  bot.onText(/\/xxxaddTrader (.+) (\S+)/, (msg, match) => {

    const traderName = match[1]
    const uid = match[2]
    listTrader[traderName] = uid;
    setTimeout(()=>{
      setInterval(()=>closeTranding(listTrader[traderName],roomId),100000)
    },5000)
    setInterval(()=>openTrading(listTrader[traderName],roomId),100000) 
    bot.sendMessage(roomId, "Add Trader "+ traderName+":"+ uid +" success");
  });
  bot.onText(/\/xxxremoveTrader (.+)/, (msg, match) => {
  
    const traderName = match[1]
    if(!listTrader[traderName])
      return bot.sendMessage(roomId, "Trader is not exist");
    else{
    delete listTrader[traderName]
     bot.sendMessage(roomId, "remove Trader "+ traderName+" success");
    }
  });
bot.onText(/\/xxxtestGroupId (.+)/, (msg, match) => {

  const resp = match[1];
  bot.sendMessage(roomId, resp);
});
bot.onText(/\/xxxchangeTrader (\S+) (\S+) (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  if(!match[1]||!match[2]||!match[3]) {
     bot.sendMessage(chatId, "Vui Long Nhap Dung Du Lieu theo form Idtradermuonthaydoi idthaydoi tentrader");
    return 
    }
  for(let Trader in listTrader)
  {
    if(listTrader[Trader] == match[1])
    {
      delete listTrader[Trader]
      listTrader[match[3]]=match[2]
      bot.sendMessage(chatId, "Thay Doi Thanh Cong")
      return 
    }
  }
  bot.sendMessage(chatId, "Id Ko Ton Tai");
  return 
});
bot.onText(/\/xxxlistTrader/, (msg, match) => {
  const chatId = msg.chat.id;
  var result = ''
  for(let trader in listTrader)
  {
    result += trader+":"+listTrader[trader]+"\n"
  }
  
  bot.sendMessage(chatId, result);
});
bot.onText(/\/xxxchangeGroupId (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  roomId = match[1];
  bot.sendMessage(chatId, "Thay Doi Id Room Thanh Cong");
});
bot.onText(/\/xxxgetGroupId/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,"Group Id :" +" "+roomId);
});
let i =0


for(let trader in listTrader)
{
  setTimeout(()=>{
    setTimeout(()=>{
      setInterval(()=>closeTranding(listTrader[trader],roomId),100000)
    },5000)
    setInterval(()=>openTrading(listTrader[trader],roomId),100000) 
   }
  ,1000*(i++))

}

}



