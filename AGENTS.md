# 給 AI 協作者的設計規範（Mystic Tarot）

這份文件描述本站視覺系統的既定做法。修改 UI 前請先讀完，維持設計語言一致。

## 液態玻璃面板（.magic-panel）

玻璃質感只用一種技術路線：**真實的 `backdrop-filter` 折射**，不要在面板上疊 SVG 濾鏡。

- 玻璃薄膜：半透明白色漸層（`rgba(255,255,255,.09)` → `.015` → `.055`），配 `backdrop-filter: blur(10px) saturate(1.65)`。
  模糊刻意壓在 10px：磨太重（20px+）會變霧面壓克力，背景細節全糊掉就沒有玻璃感——站主退過一次 22px 的版本，不要調回去。
- 邊緣折射：四邊各一道 `inset` 高光（頂部最亮 `.28`，左右 `.11`/`.08`，底部 `.07`），這是玻璃厚度的視覺來源。
- 互動：hover 時邊框轉暖金色、斜向光澤（`::after`）掃過玻璃。光澤靜止時必須完全隱藏（`opacity: 0`）——
  站主反應過靜止時掛著一道光很突兀。游標跟隨光暈（pointer-follow glow）也是站主決定移除的，不要加回來。
- 備援：`@supports not (backdrop-filter…)` 時退回深色實底漸層，不可移除。

### 為什麼不用 `feTurbulence` + `feDisplacementMap`？

SVG 位移濾鏡是做「液態扭曲」的正統技巧，但它只能扭曲**套用它的那個圖層**，
無法扭曲玻璃背後的內容（`backdrop-filter` 沒有 `filter: url()` 的位移版本）。
之前的做法是把濾鏡套在面板上的漸層裝飾層，結果只是讓裝飾紋理變形，
玻璃後面的銀河依然是直的——看起來像貼了磨砂貼紙，而不是有厚度的玻璃。
它還有額外成本：每幀 GPU 合成負擔、Safari 對 `filter: url()` 與
`backdrop-filter` 疊用的相容性問題。若日後真的要做「折射扭曲背景」，
正確的路線是 WebGL/canvas 取樣背景，而不是 SVG 濾鏡；在那之前，
rim highlight + blur + saturate 就是本站的玻璃語言。

## 銀河背景（不可更動）

`body` 的深空漸層與 `.star-field` 的星雲圖（`/galaxy/low-light-nebula-v1.webp`）
是站主指定保留的，不要換掉或蓋掉。`galaxy-drift` / `stage-galaxy-drift` 的
節奏是依站主回饋調快過的（44s / 56s，玻璃變透之後移動才看得見）；
極光（`.aurora`）同理跑 11s。調整動態時以「銀河仍清楚可見、閱讀不暈」為底線。

## 配色

紫金為主：紫羅蘭 `#7d54ff`、洋紅 `#e050b8`、琥珀金 `#e8a63c` / `#eac16b`。
避免把面板調成藍灰色調（會偏離塔羅的暖神秘感）。

## 魔法按鈕（.magic-button）

主 CTA（抽牌解讀）採 GodUI MagicButton 的三層 3D 結構：
彩虹光暈影子層（`blur(12px)`）、彩虹側邊層、會浮起/按下的正面。
彩虹五色用 oklch（含 `@supports` hex 備援），流動動畫 2.4s linear。
其他次要按鈕維持樸素樣式，避免搶掉主 CTA 的焦點。

## 全息塔羅卡（.tarot-card__front 的疊層）

翻開的牌面採 GodUI HolographicCard 的 galaxy 色向（紫粉藍 + 一站金色）：
`::before` 是箔膜 + 閃粉（`color-dodge`，用 radial mask 聚在游標處），
`::after` 是鏡面眩光（`soft-light`）。游標位置由既有的
`--shine-x` / `--shine-y`（`TarotCard` 的 `tiltCard`）驅動，傾斜角 ±9°/±11°。
箔膜要疊在牌面插畫**之上**才看得見（插畫不透明），這是刻意的
集換式卡牌質感，不要移到插畫底下。
觸控裝置改用陀螺儀驅動（`useGyroHolo`）：以第一筆感測值為基準點、
±15° 對應全範圍、rAF lerp 平滑；iOS 的授權請求必須留在使用者手勢裡。
`prefers-reduced-motion` 時陀螺儀完全不啟動。

牌面是**全出血**設計（站主指定）：插畫鋪滿整張卡、無內框無邊框，
文字（位置膠囊、牌名、正逆位）用 `.card-overlay` 壓在插畫上，
底部漸層保證可讀性，牌名有輕微浮動動畫。不要改回「插畫裝在小框裡」的版型。
放大檢視（`.card-dialog`）同理：一張沉浸式大卡，說明直接壓在圖上，
不要再包一層玻璃面板。GPT 提示詞不放在對話框內——它在牌陣舞台的
`.stage-prompt`，含語氣選擇（promptTones：溫和／犀利／務實／詩意／顯化式）。
「顯化式」不是一句語氣指示，而是站主提供的完整獨立模板
（`manifestationPrompt`，最高版本解讀原則 + 顯化肯定句），內容是站主指定的文字，
除非站主要求，不要改寫其中的原則條文。
站內三段解讀（整體解讀／下一步建議／需要留意）已由站主決定移除——
牌全部翻開後直接顯示提示詞區塊，解讀交給使用者貼到 GPT 完成。
`api/reading.js` 因此目前沒有被前端呼叫，除非站主要求，不要把站內解讀加回來。
五張牌陣（choice/love）用緊湊雙欄 + 底部置中，不要回到有空心中欄的版型。

## 牌陣選單（.spread-select）

原生 `<select>` 已換成 GodUI Combobox（fixed-enum 模式）的純 CSS 移植：
毛玻璃彈出清單、金色選中列 + 打勾、鍵盤方向鍵／Home／End／Esc 操作。
注意：它**不能**包在 `<label>` 裡——label 會把 click 轉送給內部按鈕，
造成「點選項後選單又自己打開」的 bug；要用 `.field` div + `aria-labelledby`。

## 生命靈數分頁（#numerology）

頂欄有兩個分頁（`.nav-tabs`）：塔羅占卜（預設）與生命靈數，用 hash 切換
（`#numerology`），不引入 router。規則採站主提供的系統：
- **塔羅命數**＝生日全數字加總、超過 22 再加總，落在 ≤22 的數字直接對應
  大阿爾克那（22＝0 愚人）。每張牌的優勢／劣勢文案在 `destinyMeanings`——
  內容是依站主提供的參考文章**改寫**而成（避免逐字轉載的版權問題），
  重點語意站主已認可，不要再改回逐字引用。
- **同時參考**：命數 ≥10 時，後續的再加總（如 12→3、19→10→1、22→4）
  以參考卡形式一併顯示。
- **生命靈數**＝最終歸位的 1–9，文案在 `numerologyMeanings`，作為副區塊。

## 通用守則

- 所有裝飾動畫都要進 `prefers-reduced-motion: reduce` 的停用清單。
- 專案是純 CSS（無 Tailwind），新樣式寫進 `src/overrides.css`。
- 修改後跑 `npm run build` 確認可建置。
