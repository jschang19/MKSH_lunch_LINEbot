# MKSH 2021 馬公高中 LINE 午餐小精靈 v1.0
## 設計動機

我學校（ 馬公高中 ）以前的午餐查詢 LINE 機器人停止服務了，導致同學找午餐菜單都很不方便。小弟花個午休的時間，編寫一支小程式，做成新版本的午餐查詢小精靈！

目前版本：v1.0

## 使用方法 Guide

只要告訴小精靈今天是禮拜幾，它會告訴你當天的學校午餐吃什麼，包括燴飯、麵食等。

2021 馬高午餐小精靈 LINE 好友加入連結：https://page.line.me/650cyqhe

### 範例 Example

假如今天禮拜五，傳送數字「5」，小精靈就會顯示菜單了：
![image](https://github.com/jschang19/MKSH_lunch_LINEbot/blob/main/image/screenshot.jpg)

## 程式原理 Expalination of the code
### Google 試算表 + Appscript 

我不是用 LINE 平台內建的「關鍵字回覆」，因為這樣更新菜單不太方便。我參考網路的類似引導，將菜單資料放在 Google 試算表，以 Excel "Vlookup" 函數作為原理，讓機器人依照使用者傳送的關鍵字，讀取 Google 試算表的資料並回傳該行的所有資料。

本機器人以 .gs 語法撰寫，我將程式碼放在 Google AppScript 服務中，就不用另外建立伺服器存放程式碼。程式碼也只是基本的搜尋動作，整個專案並沒有很複雜。

### 菜單更新：修改 Google 試算表即可

為了方便未來學校維護與更新，我當初就設想將菜單資料存在 Google Sheet 裡（ 類似 Google 的線上 Excel ），只要每週末把下一週的菜單更新到試算表就好。
![image](https://github.com/jschang19/MKSH_lunch_LINEbot/blob/main/image/google_sheet_pic.png)

## 參考資源 Quote

我是對 JS 不太熟悉的 Python 仔，在創造這支機器人的過程，我參考了一些網路的教學：

1. Boris 的分享小站 ( 2019 )/ 用 Line Bot 來搜尋 Google 試算表的資料 / from https://www.youtube.com/watch?v=bgKJs-CERiA&list=PLLrJ9DEA0QKOnFlOOVg25Eqk1KELHsCll
2. Sean Chuo ( 2019 ) / 兩小時打造簡單 Line Chatbot — 使用 Google Apps Script & Google Sheet API /
https://medium.com/技術筆記/兩小時打造簡單-line-chatbot-使用-google-apps-script-google-sheet-api-8fff7372ff3d

特別感謝 Boris 前輩的教學影片，大部分的程式概念是源自他的教學。
