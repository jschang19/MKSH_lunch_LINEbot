/*
@name: 馬公高中午餐查詢小精靈 LINE BOT v2
@brief: 
  利用 Javascript 編寫一個 LINE 機器人，查詢連結的 Google Sheet 資料，並回傳當天的馬公高中午餐菜色。
  請先到 Google  試算表更新當週菜色，機器人會自動爬取資料表的內容並回傳。
@author: jschang19 ( wwwsean13579@gmail.com )
@date: 2021/03/09
*/

var CHANNEL_ACCESS_TOKEN = " Put Your Token Here!";    // LINE 的金鑰
var spreadSheetId = "1DFsuGryanRF4Os5UlfaSAGAkJCmNanb0CX6Mc2quTAs";    // Google Sheet 的ID
var sheetName = "lunch";    // 工作表名稱
var searchColumn = 1;    // 搜尋第 x 欄的資料
var allowUserId = ["Ucf035f28a267b5e22edc042c4d91623c"];  //允許取得資料的使用者ID, 已修改成全面開放 ( turned to allowed. )
var spreadSheet = SpreadsheetApp.openById(spreadSheetId);
var sheet = spreadSheet.getSheetByName(sheetName);
var lastRow = sheet.getLastRow();
var lastColumn = sheet.getLastColumn();
var sheetData = sheet.getSheetValues(1, 1, lastRow, lastColumn);

// function of 回傳訊息
function doPost(e) {
  var userData = JSON.parse(e.postData.contents);
  var allowed = true;
  var clientID = userData.events[0].source.userId;

  // 檢查是否是允許的用者提出搜尋需求
  for (var i = 0; i < allowUserId.length; i++) {
    if (allowUserId[i] == clientID) {
      allowed = true;
      break;
    }
  }

  // 原限定特定 User ID 的使用者才能連線，經過修改以已全面開通
  if (!allowed) {return;}

  var searchResult = [];
  var replyMessage = [];
  var replyContent;
  var replyToken = userData.events[0].replyToken;
  var searchContent = userData.events[0].message.text;

  if (userData.events[0].type != "message") {return;}

  if (userData.events[0].message.type != "text") {return;}

  searchResult = sheetData.filter(function(item, index, array){
    return item[searchColumn - 1].toString() === searchContent;
  });

  // 回傳訊息內容迴圈
  for (var i = 0; i < searchResult.length; i++) {
    replyContent = sheetData[0][0]
    for (var j = 1; j < lastColumn; j++) {
      replyContent　+=　"\n\n"　+　sheetData[0][j]　+　": "　+　searchResult[i][j];
    }
    replyMessage.push({type:"text", text:replyContent});
    if (replyMessage.length == 5) {break;}
  }

  // 若使用者傳送關鍵字不在 Google Sheet 裡，所作的回應內容
  if (replyMessage.length == 0) {replyMessage.push({type:"text", text:"偶找不到「" + searchContent + "」的資料?"});}
  sendReplyMessage(CHANNEL_ACCESS_TOKEN, replyToken, replyMessage);
}

//回送 Line Bot 訊息給使用者
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
