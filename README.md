# Split Wizard 分帳魔法師

與朋友出遊卻因為分帳事宜鬧得不愉快嗎? 讓分帳魔法師來幫你搞清楚來龍去脈! 
本軟體為Split Wizard 後端API伺服器，需搭配前端葉面使用，並運用各項功能完成分帳難題!
後續會持續更新，並且部屬到伺服器上，出門外出旅遊就可以使用了!

## 核心功能: 
  - 可註冊帳號並且登入，透過JWT Token登入驗證機制確保安全性，密碼透過bycrypt加密，安全不遺漏!
  - 可創建多個行程並邀請同伴進入群組，並發出通知，讓同伴知道我們是一夥的!
  - 可於行程中建立共同消費的項目，讓共同消費的項目清清楚楚，紀錄支出者及使用者有哪些人。
  - 編輯或刪除錯誤的消費項目，不讓輸入錯誤的項目金額困擾著你!
  - 行程完美結束，該結算了，分帳小幫手幫你自動算好錢，並且可查看明細，讓使用者體會不再一筆一筆計算到頭痛!
  - 確認都支付完成可以封存行程，讓過去的行程保留在美好的記憶中
  - 不論新增、刪除、更改項目，都有即時通知所有旅伴，公開透明不讓小人作祟。
  - 支付完成可記錄於app中，讓支付者知道你已經付錢了，不再為有沒有還錢吵架!

## 如何在本地端運行?
 ### Environment Setup：環境安裝
- Node.js:v14.16.0
- Express.js:4.16.4
### 此專案需搭配前端頁面共同運行:

- JS React 前端Git 連結: [https://github.com/EasonLu0425/split-wizard](https://github.com/EasonLu0425/split-wizard)



1. 先將專案clone到本地端，後端程式也必須安裝完成。
```
git clone https://github.com/EasonLu0425/split-wizard.git
```
2. 安裝此專案套件
```
npm install
```
3. 在本機端建立好My SQL資料庫，DB名設定為 splitWizard，並且於終端機使用sequelize做db操作。
```
npx sequelize db:migrate
```
5. 伺服器，啟動!
```
npm run dev
```

5. 在終端機中顯示  app listening on port 5000!表示已經成功運行伺服器了。
6. 使用前端頁面進入網站，開始你的旅程吧!
7. 預設所有資料都是空的，所以需要自行註冊並且登入喔!
