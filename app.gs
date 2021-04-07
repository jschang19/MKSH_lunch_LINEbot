/*
@name: 馬公高中午餐查詢小精靈 LINE BOT v 2.1 
@brief: 
  利用 Javascript 編寫一個 LINE 機器人，查詢連結的 Google Sheet 資料，並回傳當天的馬公高中午餐菜色。
  先到 Google  試算表更新當週菜色，程式會自動爬取資料表的內容並回傳。
@author: jschang19 ( wwwsean13579@gmail.com )
@date: 2021/ 03/ 13
*/

var CHANNEL_ACCESS_TOKEN = "private information"; // LINE BOT 金鑰
var spreadSheetId = "private information";    // 試算表 ID
var sheetName = ["lunch","calender","reply"];    // 工作表名稱，以逗號分隔
var searchColumn = [1];    //搜尋第 x 欄的資料
var whiteList = [""];  // 授權白名單，已全面開啟
var whiteListMode = 0;    // 白名單模式，已全面開通
var fuzzySearch = 1;    // 啟用模糊搜尋模式
var spreadSheet = SpreadsheetApp.openById(spreadSheetId);

function doPost(e) {
  var userData = JSON.parse(e.postData.contents);
  var allowed = whiteListMode;
  var clientID = userData.events[0].source.userId;
  var replyToken = userData.events[0].replyToken;

  if ((userData.events[0].type == "follow" || userData.events[0].message.text.toLowerCase() == "findmyid") && whiteListMode === 1) {
    var replyMessage = [{type:"text", text:"您的使用者 ID 是「" + clientID + "」，請將此 ID 告知此官方帳號的擁有者加入白名單後才能開始查詢資料。"}];
    sendReplyMessage(CHANNEL_ACCESS_TOKEN, replyToken, replyMessage);
    return;
  }
  if (userData.events[0].type != "message") {return;}
  if (userData.events[0].message.type != "text") {return;}

  // 檢查是否是允許的用者提出搜尋需求, 已關閉
  for (var i = 0; i < whiteList.length; i++) {
    if (whiteList[i] == clientID) {
      allowed = 0;
      break;
    }
  }

  // 原程式的回傳 token 功能
  if (allowed === 1) {
    var replyMessage = [{type:"text", text:"您的使用者 ID 是「" + clientID + "」，請將此 ID 告知此官方帳號的擁有者加入白名單後才能開始查詢資料。"}];
    sendReplyMessage(CHANNEL_ACCESS_TOKEN, replyToken, replyMessage);
    return;
  }

  var replyMessage = [];
  var replyToken = userData.events[0].replyToken;
  var searchContent = userData.events[0].message.text;

  for (var i = 0; i < sheetName.length; i++) {
    var searchResult = [];
    var sheet = spreadSheet.getSheetByName(sheetName[i]);
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    var sheetData = sheet.getSheetValues(1, 1, lastRow, lastColumn);
    
    // 搜尋 Google 試算表內的資料
    for (var j = 0; j < searchColumn.length; j++){
      var searchTemp = sheetData.filter(function(item, index, array){
        if (fuzzySearch == 0) {return item[searchColumn[j] - 1].toString().toLowerCase() === searchContent.toLowerCase();}
        else {return item[searchColumn[j] - 1].toString().toLowerCase().indexOf(searchContent.toLowerCase()) != -1 ;}
      });
      searchResult = searchResult.concat(searchTemp);
    }
    
  if (searchResult.length > 0) {
   var replyContent = "";
   searchResult = uniqueArrayElement(searchResult);

  // Calender 結果的訊息格式設定
    if ( sheetName[i] == "calender" ){ 
      replyContent += sheetData[0][0]; // 顯示標題
      replyContent += "\n\n";
      var resultorder = 0; // 宣告為搜尋結果的順序數字
      replyContent += "共有 "+ searchResult.length +" 個相關結果"+ " 🔎" +"\n-";
      for (var k = 0; k < searchResult.length; k++) {
        for (var l = 1; l < lastColumn; l++) {
          if ( sheetData[0][l] == "日期"){
            replyContent += "\n"+ searchResult[k][l]; // 到「日期」欄位時，不顯示 resultorder 和冒號
          }
          else{
            resultorder = k+1;
            replyContent += "\n" + searchResult[k][l]; // 顯示「搜尋結果」時，顯示resultorder 
          }
      }
      replyContent += "\n-";
    }
  }

  // Lunch 午餐結果的訊息格式設定
  else if( sheetName[i] == "lunch"){
    replyContent += sheetData[0][0];
    for (var k = 0; k < searchResult.length; k++) {
      for (var l = 1; l < lastColumn; l++) {
      replyContent += "\n\n" + sheetData[0][l] + "：" + searchResult[k][l] ;
      }
    }
  }

  // reply 工作表的訊息格式設定
  else if ( sheetName[i] == "reply"){
    replyContent = "";
    for (var k = 0; k < searchResult.length; k++) {
      for (var l = 1; l < lastColumn; l++) {
      replyContent += searchResult[k][l] ;
      }
    }
  }

  replyMessage.push({type:"text", text:replyContent});
    }
    if (replyMessage.length == 5) {break;}
  }

  // 搜尋關鍵字沒在資料庫的動作
  if (replyMessage.length == 0) {

    // 指定關鍵字的回傳訊息
    if( searchContent == "幹"){
    replyMessage.push({type:"text", text:"母湯喔"});
  }
    else if (searchContent == "張君祥"){
      replyMessage.push({type:"text", text:"張君祥 Shawn 是小精靈的作者喔！\n他的 Blog: www.medium.com/jun-shawn/\nInstagram:www.instagram.com/jschang.tech/"});
    }
    else if(searchContent == "204"){
      replyMessage.push({type:"text", text:"最酷的一班"});
    }
    else if(searchContent == "蘋果仁"){
      replyMessage.push({type:"text", text:"那是 Shawn 工作的網路媒體，分享各種 iPhone 新聞與教學\nwww.applealmond.com/"});
    }
    else if(searchContent == "蘋果人"){
      replyMessage.push({type:"text", text:"是「蘋果仁」～\n那是 Shawn 工作的網路媒體，分享各種 iPhone 新聞與教學\nwww.applealmond.com/"});
    }
    else if(searchContent == "applealmond"){
      replyMessage.push({type:"text", text:"那是 Shawn 工作的網路媒體，分享各種 iPhone 新聞與教學\nwww.applealmond.com/"});
    }
    else if(searchContent == "馬公高中"){
      replyMessage.push({type:"text", text:"http://mksh.phc.edu.tw/"});
    }
    
    // 非指定關鍵字的預設回覆
    else{
      replyMessage.push({type:"text", text:"查詢不到「" + searchContent + "」的資料"});
      replyMessage.push({type:"text", text:"傳送「1 - 5」可以查詢菜單，輸入活動可以查詢行事曆～"});
      }
  }
    

  sendReplyMessage(CHANNEL_ACCESS_TOKEN, replyToken, replyMessage);
}

//移除陣列中重複的元素
function uniqueArrayElement(arrayData) {
  var result = arrayData.filter(function(element, index, arr){
    return arr.indexOf(element) === index;
  });
  return result;
}

//回傳訊息內容給使用者
function sendReplyMessage(CHANNEL_ACCESS_TOKEN, replyToken, replyMessage) {
  var url = "https://api.line.me/v2/bot/message/reply";

  UrlFetchApp.fetch(url, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": replyMessage,
    }),
  });
}
// End of the program.
// Last editted by Jun Shawn @applealmond.com
