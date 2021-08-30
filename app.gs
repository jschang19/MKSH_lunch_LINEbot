// 午餐查詢 LINE Bot，由張君祥 Chun Shawn 製作

function doPost(e) {
  // LINE Messenging API Token
  var CHANNEL_ACCESS_TOKEN = '';
  // 以 JSON 格式解析 User 端傳來的 e 資料
  var msg = JSON.parse(e.postData.contents);


  // 從接收到的 JSON 資料中取出 replyToken 和發送的訊息文字
  const replyToken = msg.events[0].replyToken;
  const userMessage = msg.events[0].message.text;
  const user_id = msg.events[0].source.userId;
  const nameurl = "https://api.line.me/v2/bot/profile/" + user_id;

  // 取得午餐 Google Sheet 資料表並解析
  const sheet_url = 'https://docs.google.com/spreadsheets/d/**********';
  // 工作表名稱
  const sheet_name = 'work';
  var SpreadSheet = SpreadsheetApp.openByUrl(sheet_url);
  var SheetName = SpreadSheet.getSheetByName(sheet_name);

  


  // Get 某格資料語法：
  // var data = SheetName.getRange(欄,行).getValue();

  // 觸發搜尋午餐的關鍵字（ 星期幾 ）
  var search_weekday = ["今天", "禮拜一", "禮拜二", "禮拜三", "禮拜四", "禮拜五","1","2","3","4","5"];

  // 宣告自助餐、燴飯與麵食格式
  var staple = ""; // 主食
  var main_dish = ""; // 主菜
  var side_dish = []; // 副菜
  var main_risotto = ""; // 燴飯
  var side_dish_risotto = ""; // 燴飯配菜
  var noddle = ""; // 麵食

  if (typeof replyToken === 'undefined') {
    return;
  };

  /*
  * 2. 定義回傳訊息內容（ reply_message ）
  */

  // 查詢週一到週五的午餐

  if (userMessage == "午餐") {
    var reply_message = [{
      "type": "text",
      "text": "要查禮拜幾的菜單？",
      // 快速回覆按鈕
      "quickReply": {
        "items": [
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "今天的",
              "text": "今天"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "禮拜一",
              "text": "禮拜一"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "禮拜二",
              "text": "禮拜二"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "禮拜三",
              "text": "禮拜三"
            }

          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "禮拜四",
              "text": "禮拜四"
            }

          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "禮拜五",
              "text": "禮拜五"
            }

          }
        ]
      }
    }];
  }

  // 回傳當天 or 指定天的菜單內容，以 Flex Message 格式呈現
  // User 回傳了「午餐」的星期幾，或是選擇查詢當天的午餐內容
  // 只有包含在 search_weekday  Array 的關鍵字才會執行這裡

  else if (search_weekday.includes(userMessage)) {
    var weekday = 0; // 禮拜（幾）的代號

    switch (userMessage) {

      case "1":
      case "禮拜一":
        weekday = 1;
        break;
      
      case "2":
      case "禮拜二":
        weekday = 2;
        break;

      case "3":
      case "禮拜三":
        weekday = 3;
        break;

      case "禮拜四":
      case "4":
        weekday = 4;
        break;

      case "禮拜五":
      case "5":
        weekday = 5;
        break;

      default:
        // 亦為 case "今天"
        var currentDate = Utilities.formatDate(new Date(), "GMT+8", "E"); // 指定 GMT +8 時區,取得 User 執行的時間，解析抓取星期格式資料 ( E 為星期簡寫 ) 
        switch (currentDate) {
          case "Mon":
            weekday = 1;
            break;

          case "Tue":
            weekday = 2;
            break;

          case "Wen":
            weekday = 3;
            break;

          case "Thu":
            weekday = 4;
            break;

          case "Fri":
            weekday = 5;
            break;
        }
        break;
    }

    // 抓取主食資料
    staple = SheetName.getRange(weekday + 1, 2).getValue();
    // 主菜資料
    main_dish = SheetName.getRange(weekday + 1, 3).getValue();
    // 燴飯資料 
    main_risotto = SheetName.getRange(weekday + 1, 7).getValue();
    // 燴飯配菜資料
    side_dish_risotto = SheetName.getRange(weekday + 1, 8).getValue();
    // 麵食資料
    noddle = SheetName.getRange(weekday + 1, 9).getValue();

    // 迴圈用於抓取副菜資料
    for (var side_x = 4; side_x <= 6; side_x++) {
      side_dish.push(SheetName.getRange(weekday + 1, side_x).getValue());
    }

    // 設定 Flex Message 格式內容，資料變數套入 JSON 檔案

    reply_message = [{
      "type": "flex",
      "altText": userMessage + "的午餐菜單",
      "contents": {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "自助餐菜單",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "主食",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 2
                        },
                        {
                          "type": "text",
                          "text": staple,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ],
                      "margin": "10px"
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "主菜",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 2
                        },
                        {
                          "type": "text",
                          "text": main_dish,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ],
                      "margin": "10px"
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "副菜",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 2
                        },
                        {
                          "type": "text",
                          "text": side_dish[0] + ", " + side_dish[1] + ", " + side_dish[2],
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ],
                      "margin": "10px"
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "spacer",
                  "size": "sm"
                }
              ],
              "flex": 0
            }
          }, // 自助餐 ends
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "燴飯 & 麵食",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "燴飯",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 2
                        },
                        {
                          "type": "text",
                          "text": main_risotto,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ],
                      "margin": "10px"
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "燴飯配菜",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 2
                        },
                        {
                          "type": "text",
                          "text": side_dish_risotto,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ],
                      "margin": "10px"
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "麵食",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 2
                        },
                        {
                          "type": "text",
                          "text": noddle,
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ],
                      "margin": "10px"
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "spacer",
                  "size": "sm"
                }
              ],
              "flex": 0
            }
          }, // 麵食和燴飯 ends
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "功能選單",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "不知道吃什麼？點「隨機選」，我幫你隨機推薦",
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "button",
                  "style": "primary",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": "隨機選",
                    "text": "吃什麼"
                  }
                },
                {
                  "type": "button",
                  "style": "secondary",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": "菜單有錯",
                    "text": "菜單有錯"
                  }
                },
                {
                  "type": "spacer",
                  "size": "sm"
                }
              ],
              "flex": 0
            }
          } // 功能選單
        ]
      }
    }] // end of reply_content[]
  }

  // 當 User 不確定吃什麼，可隨機抽籤

  else if (userMessage == "吃什麼") {
    // JS Random Function，隨機選取數字
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    // 隨機選取 0, 1, 2 一個數字
    var random_choice = getRandomInt(3);
    var output = ""; // 選擇結果

    switch (random_choice) {
      case 0:
        output = "自助";
        break;
      case 1:
        output = "燴飯"
        break;
      case 2:
        output = "麵食";
        break;

    }

    // 設定 Flex Message 格式內容

    reply_message = [{
      "type": "text",
      "text": "今天吃" + output + "怎麼樣？",
      "quickReply": {
        "items": [
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "再抽一次",
              "text": "吃什麼"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "看菜單",
              "text": "今天"
            }
          }
        ]
      }
    }]

  }


  else if (userMessage == "開始") {
    reply_message = [
      {
        "type": "template",
        "altText": "午餐小精靈使用教學",
        "template": {
          "type": "buttons",
          "imageAspectRatio": "rectangle",
          "imageSize": "cover",
          "imageBackgroundColor": "#FFFFFF",
          "title": "小精靈使用教學",
          "text": "我可以幫你查午餐！下面是叫醒我的關鍵字",
          "defaultAction": {
            "type": "message",
            "label": "查菜單打「午餐」",
            "text": '午餐'
          },
          "actions": [
            {
              "type": "message",
              "label": "查菜單打「午餐」",
              "text": '午餐'
            },
            {
              "type": "message",
              "label": "不能決定打「吃什麼」",
              "text": '吃什麼'
            },
            {
              "type": "message",
              "label": "有問題打「菜單有錯」",
              "text": '菜單有錯'
            }
          ]
        }
      }
    ]
  }

  else if (userMessage == "菜單有錯") {
    reply_message = reply_message = [{
      "type": "flex",
      "altText": "抱歉！收到你的回報了",
      "contents": {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": "http://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "對不起！張君祥這個大笨蛋，小精靈等等幫你打他屁股～",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                },
                {
                  "type": "text",
                  "text": "請幫小精靈叫張君祥改菜單，或是查看學校的最新菜單",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5,
                  "margin": "19px"
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "style": "link",
              "height": "sm",
              "action": {
                "type": "uri",
                "label": "轉達張君祥",
                "uri": "https://linecorp.com"
              }
            },
            {
              "type": "button",
              "style": "link",
              "height": "sm",
              "action": {
                "type": "uri",
                "label": "看學校菜單",
                "uri": "http://www.mksh.phc.edu.tw/Default.aspx"
              }
            },
            {
              "type": "spacer",
              "size": "sm"
            }
          ],
          "flex": 0
        }
      }
    }]
  }

  // 測試用 function

  else if (userMessage == "test") {
    reply_message = [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": "http://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Meun updated sm",
              "weight": "bold",
              "size": "xl"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Place",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Time",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": "10:00 - 23:00",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "spacer",
              "size": "sm"
            }
          ],
          "flex": 0
        }
      }
    }]
  }

  else {
    if (userMessage == "搜尋") {
      reply_message = [
        {
          "type": "template",
          "altText": "This is a buttons template",
          "template": {
            "type": "buttons",
            "thumbnailImageUrl": "https://i1.zi.org.tw/applealmond/2021/07/1625978742-99578d641ac3589d2c445b908aae80b8.jpg",
            "imageAspectRatio": "rectangle",
            "imageSize": "cover",
            "imageBackgroundColor": "#FFFFFF",
            "title": userMessage + "的搜尋結果",
            "text": "找到了！點選連結看相關文章>>",
            "defaultAction": {
              "type": "uri",
              "label": "看文章",
              "uri": 'https://applealmond.com/?s=' + userMessage
            },
            "actions": [
              {
                "type": "uri",
                "label": "看文章",
                "uri": 'https://applealmond.com/?s=' + userMessage
              }
            ]
          }
        }
      ]
    }

    // 其他非午餐查詢的關鍵字回應
    else {
      switch (userMessage) {

        case "果仁":
        case "蘋果仁":
        case "難吃":
          reply_message = [{
            "type": "text",
            "text": "母湯喔～"
          }]
          break;

        default:

          reply_message = [{
            "type": "text",
            "text": "小精靈 ㄎㄨㄚ ㄅㄡˊ，請試看看其他關鍵字～",
            "quickReply": {
              "items": [
                {
                  "type": "action",
                  "action": {
                    "type": "message",
                    "label": "查午餐",
                    "text": "午餐"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type": "message",
                    "label": "菜單有錯",
                    "text": "菜單有錯"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type": "message",
                    "label": "今天吃什麼",
                    "text": "今天"
                  }

                }
              ]
            }
          }]

      }


    }
  }

  //回傳訊息給line 並傳送給使用者
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': reply_message,
    }),
  });
}

