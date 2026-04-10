# Mystic Tarot

神秘塔羅占卜網站，前端抽牌，後端可透過 Gemini 產生 AI 解讀。

## Features

- 繁體中文介面
- 單張指引、時間軸、兩難抉擇牌陣
- 前端抽牌，後端 Gemini 解讀
- 沒設定 Gemini 時會自動退回本地備援解讀
- API key 不放在前端

## Deploy

這個版本適合部署到支援 Node serverless function 的平台，例如 Vercel。

### Environment Variable

設定：

`GEMINI_API_KEY=你的 Gemini API key`

### Project Structure

- `index.html`: 前端頁面
- `api/reading.js`: Gemini 後端 API

### Notes

- 若只部署靜態頁面而沒有後端，網站仍可抽牌，但會使用本地備援解讀。
- 若要讓朋友一起使用 AI 解讀，請把整個專案部署到支援後端函式的平台。
