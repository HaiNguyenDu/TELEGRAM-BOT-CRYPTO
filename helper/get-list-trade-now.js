


export const getAllTradeNow= async (uid)=>{
    var result = []
    var traderNickName=""  
    for(let i =1;i<25;i++)
    {
       
            const url = `https://futures.mexc.com/copyFutures/api/v1/trader/orders/v2?limit=1000&orderListType=ORDER&page=${i}&uid=`
            const respone = await fetch(url+uid)   
            .then(response => response.json())
            .then((response)=>{
                if(!response.data.content) return
                else return response.data.content
            })
            if (!respone)break; 
            if (respone.length == 0) break;
            if(traderNickName=="") traderNickName = respone[0].traderNickName
                result = result.concat(respone)
    }
    return result
}