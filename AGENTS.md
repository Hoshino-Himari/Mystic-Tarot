# 給 AI 協作者的設計規範（Mystic Tarot）

這份文件描述本站視覺系統的既定做法。修改 UI 前請先讀完，維持設計語言一致。

## 液態玻璃面板（.magic-panel）

玻璃質感只用一種技術路線：**真實的 `backdrop-filter` 折射**，不要在面板上疊 SVG 濾鏡。

- 玻璃薄膜：半透明白色漸層（`rgba(255,255,255,.13)` → `.02` → `.09`），配 `backdrop-filter: blur(22px) saturate(1.7)`，讓面板真正模糊、加飽和背後的銀河與極光。
- 邊緣折射：四邊各一道 `inset` 高光（頂部最亮 `.42`，左右 `.16`/`.11`，底部 `.09`），這是玻璃厚度的視覺來源。
- 互動：hover 時邊框轉暖金色、斜向光澤（`::after`）掃過玻璃。請保留這個互動。
  游標跟隨光暈（pointer-follow glow）是站主決定移除的——光源太多，不要加回來。
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

`body` 的深空漸層、`.star-field` 的星雲圖（`/galaxy/low-light-nebula-v1.webp`）
與 `galaxy-drift` / `stage-galaxy-drift` 漂移動畫是站主指定保留的，
任何改動都不要碰這一區。極光光暈（`.aurora`）疊在銀河之上、面板之後，
透明度刻意壓低（.3–.42），調整時以「銀河仍清楚可見」為底線。

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

## 通用守則

- 所有裝飾動畫都要進 `prefers-reduced-motion: reduce` 的停用清單。
- 專案是純 CSS（無 Tailwind），新樣式寫進 `src/overrides.css`。
- 修改後跑 `npm run build` 確認可建置。
