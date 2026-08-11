import { useEffect, useRef, useState } from 'react';

const spreads = [
  { id: 'timeline', name: '時間之流', count: 3, positions: ['過去', '現在', '未來'], description: '看見一件事如何走到此刻，以及接下來可能的走向。', usage: '適合：想整理事件脈絡、了解目前狀態與近期方向。' },
  { id: 'holy-triangle', name: '聖三角牌陣', count: 3, positions: ['我以為的狀態', '真實的狀態', '建言'], description: '從認知與真實的落差中，看見尚未注意到的盲點。', usage: '適合：感到卡關、想釐清事件真相或自己忽略了什麼。' },
  { id: 'core', name: '直指核心', count: 4, positions: ['問題核心', '障礙', '對策', '優勢'], description: '把困住你的關鍵、可用資源與下一步放在同一張圖裡。', usage: '適合：某件事一直沒有起色，想知道原因與能做的事。' },
  { id: 'choice', name: '二選一與可能結果', count: 5, positions: ['選項 A 的狀態', '選項 B 的狀態', 'A 可能結果', 'B 可能結果', '我的狀態'], description: '比較兩個方向各自的條件與可能發展，協助你做判斷。', usage: '適合：工作機會、學習方向等具體選擇；不是替你決定。' },
  { id: 'love', name: '感情萬用牌陣', count: 5, positions: ['我的狀態', '我對關係的態度', '對方的狀態', '對方對關係的態度', '可能結果'], description: '梳理關係中的互動與態度，將結果視為會隨選擇改變的可能性。', usage: '適合：想理解一段關係當下的互動，以及如何更好地回應。' },
];

const questionGroups = {
  感情: ['這段關係裡，我最需要先理解自己的什麼感受？', '我可以怎麼讓這段關係更靠近我真正重視的樣子？', '如果我主動溝通，最值得留意的地方是什麼？', '這段關係正在提醒我學會什麼？', '我還沒看見的互動盲點是什麼？', '我可以如何照顧自己，同時好好面對這段關係？', '我反覆被相似的人吸引，背後可能有什麼模式？', '迎接下一段關係前，我想先準備好什麼？'],
  工作: ['我目前最能發揮的優勢是什麼？', '讓我停在原地的關鍵阻礙是什麼？', '面對轉職，我現在最該準備哪一件事？', '我想經營副業，最適合從哪個小方向開始？', '這兩個工作方向各自會帶來什麼學習？', '我可以怎麼重拾工作上的成就感？', '我與合作夥伴的溝通，最需要調整什麼？', '接下來一個月，我能採取的務實行動是什麼？'],
  金錢: ['我目前和金錢的關係，最需要被看見的是什麼？', '我對安全感的擔心，正在怎麼影響我的選擇？', '我可以從哪裡更善用現有的資源？', '我想提升收入，下一步最值得投入的是什麼？', '我在哪個消費習慣裡，最需要停下來覺察？', '我對「值得擁有更多」的信念，需要怎麼調整？', '我想建立更穩定的金錢節奏，可以先做什麼？', '這個階段的金錢課題，想教會我什麼？'],
  人際: ['我在這段關係中，真正想被理解的是什麼？', '我可以怎麼說清楚自己的界線？', '我總是過度付出的模式，從哪裡開始調整？', '這段友誼目前最需要被好好溝通的是什麼？', '我在團體裡感到格格不入，這份感受想提醒我什麼？', '我可以怎麼更自在地接受別人的支持？', '我與家人的互動中，最需要被看見的需求是什麼？', '這段關係裡，我該收回哪一部分的勉強？'],
  自我: ['我此刻最真實的需要是什麼？', '我感到卡住的地方，正在邀請我看見什麼？', '這份焦慮背後，我真正害怕失去的是什麼？', '我現在最需要放下的內在模式是什麼？', '我可以如何重新建立更健康的節奏？', '這個人生階段，我最重要的課題是什麼？', '我被「不夠好」困住時，可以怎麼對待自己？', '我下一步可以做哪一件小事，讓自己更靠近想要的生活？'],
};

const questionTips = [
  ['問現況', '先聚焦一件正在發生的事。'],
  ['問自己的選擇', '把焦點放回你能回應與行動的部分。'],
  ['用開放式問法', '少用是非題，多問「我可以怎麼做」。'],
];

const majorArtSlugs = ['fool', 'magician', 'high-priestess', 'empress', 'emperor', 'hierophant', 'lovers', 'chariot', 'strength', 'hermit', 'wheel', 'justice', 'hanged-man', 'death', 'temperance', 'devil', 'tower', 'star', 'moon', 'sun', 'judgement', 'world'];

const majorArcana = [
  ['愚者', 'The Fool', '新的開始', '勇敢走向未知，新的可能性正在打開。', '衝動或過度樂觀，可能讓你忽略必要的準備。'],
  ['魔術師', 'The Magician', '主動創造', '你手上其實已有資源，關鍵在於立即行動。', '能量分散、說得多做得少，需要把注意力收回。'],
  ['女祭司', 'The High Priestess', '直覺', '放慢速度，傾聽內在真正知道的答案。', '過度觀望或把情緒藏太深，反而讓真相更模糊。'],
  ['皇后', 'The Empress', '滋養', '關係、創意與照顧能量正在成長。', '過度付出或沉溺舒適，會讓自己失去平衡。'],
  ['皇帝', 'The Emperor', '秩序', '建立界線與規則，事情會更穩。', '控制慾過強，會讓關係和局勢變得僵硬。'],
  ['教皇', 'The Hierophant', '信念與方法', '找回可信的做法、制度或前輩指引。', '舊規則可能已不再適合現在的你。'],
  ['戀人', 'The Lovers', '選擇', '真正的答案來自價值是否一致。', '猶豫與分裂感，讓簡單選擇也變困難。'],
  ['戰車', 'The Chariot', '推進', '只要把力量對準方向，就能往前。', '用力過猛，反而掩蓋了內在衝突。'],
  ['力量', 'Strength', '溫柔的堅定', '真正的力量來自穩定與節制。', '壓抑太久的情緒，可能在不對的時候爆開。'],
  ['隱者', 'The Hermit', '沉澱', '拉開距離後，你會看得更清楚。', '過度封閉，容易把思考變成停滯。'],
  ['命運之輪', 'Wheel of Fortune', '轉變', '局勢正在移動，順勢調整比硬撐更有用。', '抗拒變化，只會增加不必要的摩擦。'],
  ['正義', 'Justice', '平衡與誠實', '誠實面對因果與責任，答案會更清楚。', '逃避代價，只會延後真正的解決。'],
  ['吊人', 'The Hanged Man', '換個角度', '暫停不一定是失敗，也可能是在換視角。', '沒有方向的拖延，會把等待變成困住。'],
  ['死神', 'Death', '結束與重生', '讓舊的階段結束，新的空間才會打開。', '不肯放手，會讓轉變變得更辛苦。'],
  ['節制', 'Temperance', '調和', '把節奏調回平衡，局勢會重新流動。', '過量、極端與失衡，正在消耗你的能量。'],
  ['惡魔', 'The Devil', '執著與束縛', '先看見自己被什麼綁住，才能真正鬆開。', '恐懼、依附或慾望正在放大問題。'],
  ['高塔', 'The Tower', '破除幻象', '突然的變化是在逼你回到真相。', '拖越久，舊結構崩掉時的衝擊越大。'],
  ['星星', 'The Star', '希望', '修復與清明正在慢慢回來。', '失望感可能比現實本身更重。'],
  ['月亮', 'The Moon', '模糊與潛意識', '現在不是所有事都看得清，先保持覺察。', '焦慮與投射可能扭曲了事實。'],
  ['太陽', 'The Sun', '明朗', '真相、溫暖與信心正逐漸靠近。', '只看樂觀面，可能會忽略細節。'],
  ['審判', 'Judgement', '召喚', '你正被要求回應更深層的內在召喚。', '自責與反覆後悔，會讓你聽不見真正的訊息。'],
  ['世界', 'The World', '完成', '一個循環即將完整收束，準備進入下一章。', '尾聲沒收好，新的開始就難以展開。'],
].map(([nameZh, nameEn, keywords, upright, reversed], index) => {
  const number = String(index).padStart(2, '0');
  return {
    nameZh,
    nameEn,
    keywords,
    upright,
    reversed,
    arcana: '大阿爾克那',
    imageSrc: `/tarot-art/major-${number}-${majorArtSlugs[index]}.webp`,
  };
});

const minorRanks = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍者', '騎士', '皇后', '國王'];
const suitDetails = {
  權杖: ['行動與熱情', '提醒你主動推進，把想法化為行動。', '拖延、躁進或疲乏，可能正在削弱你的火力。'],
  聖杯: ['情感與關係', '情緒、連結與內心需求是關鍵。', '情緒積壓或混亂，正在遮住問題核心。'],
  寶劍: ['思考與決斷', '把事實說清楚，判斷才會穩。', '過度思考，可能比現實本身更吵雜。'],
  錢幣: ['現實與穩定', '把注意力放回資源、身體與長期穩定。', '對安全感的壓力，正在打亂你的專注。'],
};
const suitArtSlugs = { 權杖: 'wands', 聖杯: 'cups', 寶劍: 'swords', 錢幣: 'pentacles' };
const rankArtSlugs = { 一: '01', 二: '02', 三: '03', 四: '04', 五: '05', 六: '06', 七: '07', 八: '08', 九: '09', 十: '10', 侍者: 'page', 騎士: 'knight', 皇后: 'queen', 國王: 'king' };
const minorArcana = Object.entries(suitDetails).flatMap(([suit, [keywords, upright, reversed]]) => minorRanks.map((rank) => ({
  nameZh: `${suit}${rank}`,
  nameEn: `${rank} of ${suit}`,
  keywords,
  upright,
  reversed,
  arcana: '小阿爾克那',
  imageSrc: `/tarot-art/${suitArtSlugs[suit]}-${rankArtSlugs[rank]}.webp`,
})));
const deck = [...majorArcana, ...minorArcana];

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function shuffle(cards) { return [...cards].sort(() => Math.random() - 0.5); }
function positionMeaning(spreadId, position) {
  const meanings = {
    timeline: { 過去: '看見這件事發展到現在的重要脈絡。', 現在: '指出當下最需要被理解的狀態。', 未來: '顯示照目前節奏前進時，可能出現的走向。' },
    'holy-triangle': { 我以為的狀態: '看見你目前如何理解這件事。', 真實的狀態: '提供另一個角度，提醒你尚未注意的真相。', 建言: '把看見轉為下一步可採取的方向。' },
    core: { 問題核心: '聚焦這件事真正的關鍵。', 障礙: '提醒目前最需要正視或調整的環節。', 對策: '提供一個可以開始實踐的方向。', 優勢: '指出你已經具備、可以善用的資源與能力。' },
    choice: { '選項 A 的狀態': '呈現第一個方向當下的條件與氛圍。', '選項 B 的狀態': '呈現第二個方向當下的條件與氛圍。', 'A 可能結果': '顯示若選擇 A，可能出現的發展。', 'B 可能結果': '顯示若選擇 B，可能出現的發展。', 我的狀態: '提醒你做選擇前最需要留意的準備與需求。' },
    love: { 我的狀態: '看見你此刻帶進這段關係的感受與期待。', 我對關係的態度: '覺察你在這段關係中的互動方式與需求。', 對方的狀態: '提供理解對方目前狀態的參考角度。', 對方對關係的態度: '觀察你感受到的互動訊號與節奏。', 可能結果: '呈現當下條件下的可能走向，而非固定結論。' },
  };
  return meanings[spreadId][position];
}
const numerologyMeanings = {
  1: ['開創者', '獨立、意志與行動力是你的底色。你適合先行、開路、把想法變成第一步；課題是學會等待與傾聽，讓別人跟得上你的速度。'],
  2: ['協調者', '敏感、體貼、擅長傾聽與合作。你能看見別人忽略的細節與情緒；課題是建立界線——「配合」不該是你唯一的相處方式。'],
  3: ['表達者', '創意、語言與感染力。你天生知道怎麼把感受說成故事；課題是把散落的靈感收攏成完整的作品，而不是停在有趣的開頭。'],
  4: ['建構者', '穩定、秩序與可靠。你擅長把混亂整理成制度、把承諾做成結果；課題是允許計畫之外的事發生——穩定不等於不變。'],
  5: ['冒險者', '自由、變化與體驗是你的養分。你學得快、適應力強；課題是分辨「探索」與「逃離」，自由需要一個回得來的地方。'],
  6: ['照顧者', '愛、責任與療癒。你習慣把身邊的人照顧好，也常被託付信任；課題是把自己也放進照顧名單，付出前先確認自己有餘裕。'],
  7: ['探尋者', '思考、直覺與對真相的渴望。你不接受表面的答案，喜歡把事情想透；課題是別讓分析變成距離，理解之後記得靠近。'],
  8: ['實踐者', '力量、目標與豐盛。你對成果與影響力有天生的嗅覺；課題是分清「掌控」與「承擔」——真正的力量包含允許別人幫你。'],
  9: ['夢想家', '慈悲、理想與給予。你容易看見更大的圖像，也願意為別人多走一步；課題是學會收尾與收下——接受也是給予的一部分。'],
};

const cardForNumber = (value) => majorArcana[value === 22 ? 0 : value];

// 塔羅命數：生日加總（>22 再加總）對應大阿爾克那的處事態度，[優勢, 劣勢]。
const destinyMeanings = {
  0: ['天生自由、樂觀率真，勇於嘗試新事物、不被過去綁住，凡事願意「先做了再說」，常為身邊的人帶來新鮮感與行動力。', '熱度來得快去得也快，計畫容易做一半就跳去下一個；有時太天真、缺乏防備而吃虧，也可能因衝動做出讓自己後悔的決定。'],
  1: ['多才多藝、行動力強，腦筋轉得快，擅長整合手邊資源把想法做出來；表達與說服力出色，適合創業、行銷與業務型的舞台。', '什麼都想做，常常同時開好幾個坑卻難收尾；太相信自己的能力時會聽不進建議，也可能給人「話術強、不夠真誠」的印象。'],
  2: ['直覺敏銳、觀察力強，內心世界豐富，容易看穿事情的本質與他人的真實情緒；帶點神祕氣質，適合研究、洞察與心靈領域，多半看破不說破。', '習慣把事情放在心裡、不擅長主動表達需求，讓人覺得猜不透；想太多容易內耗，遇到衝突傾向退縮或冷處理，誤會反而越積越深。'],
  3: ['溫暖、有同理心與藝術天分，懂得享受生活也懂得照顧人；包容力強、誰都處得來，是身邊人的能量補給站，在創作、美感與療癒領域特別有優勢。', '容易把別人的事當自己的事操心，控制慾與佔有慾會不自覺浮現；情緒起伏較大，有時會用「我都是為你好」給對方壓力。'],
  4: ['天生的領導者，邏輯清晰、執行力強、扛得住事，是團隊裡讓人安心的存在；原則感強、有責任，遇到危機反而更冷靜，會主動站出來承擔。', '固執、不易妥協，容易顯得嚴肅、不近人情；習慣用做事代替說愛，親近的人不易感受到溫度，嚴重時會因太獨裁而變得難相處。'],
  5: ['穩重、值得信賴，喜歡有架構、有系統的事物，是朋友想諮詢意見的「智慧長者」；重視傳統與規則，做事踏實不冒進，適合教學、顧問與傳承。', '偏保守，對新觀念、新做法接受得比較慢，容易卡在「以前都是這樣做」的框架裡；有時會不自覺說教，或用自己的標準要求別人。'],
  6: ['人緣好、有審美眼光，重視關係的品質，擅長在對話中激盪靈感；同理心強，能看見關係裡彼此的需求，在藝術、創意與企劃上有天分。', '優柔寡斷是最大課題，面對選擇常常糾結很久；太在意他人感受而委屈自己，感情裡容易陷入「同時被吸引、又害怕做決定」的拉扯。'],
  7: ['目標感與行動力一流，認定的事會排除萬難往前衝；自律、有勝負心，衝刺時帶著毫無畏懼的信心，適合需要突破與業績的戰場。', '太急、太想贏，容易忽略細節與身邊人的感受；習慣自己握方向盤、不輕易交出選擇權，聽不太進別人的意見，也容易把自己逼到極限。'],
  8: ['外表溫柔、內在堅韌，情緒管理能力強；遇到壓力能用柔軟的方式化解，是那種不靠強硬、靠氣場就能讓事情前進的人。', '太會忍，情緒常往肚裡吞，爆發時連自己都嚇一跳；在關係中過度包容、把對方的問題也攬到自己身上，久了累積疲憊與委屈。'],
  9: ['思考深、有智慧，獨處時反而最有生產力；不隨波逐流、有自己的人生節奏，能在安靜中看清事情的本質，適合研究與深度領域。', '社交是一種消耗，容易被貼上高冷、難親近的標籤；遇到問題偏好自己鑽研、不願求助，有時會鑽牛角尖，也較難融入熱鬧的群體。'],
  10: ['適應力極強、懂得順勢而為，能在變動中找到自己的機會；視野大、看得見因果循環，運氣通常不差，常在對的時間遇到對的人與事。', '有時太相信「命運自有安排」而缺乏主動，把該做的決定推給時機；生活節奏起伏大，需要刻意建立穩定的習慣，才不會被環境牽著走。'],
  11: ['公正、客觀、邏輯清晰，是大家遇到糾紛時最想找的「裁判」；有原則、誠實、重視因果與責任，適合法律、財務、決策與管理。', '太理性，有時顯得冷漠、難以共情；對是非黑白看得很重，容易在心裡評判他人，也用高標準逼自己，長期活在「不夠好」的壓力裡。'],
  12: ['擅長換位思考，看得見一般人看不到的另一面；有奉獻精神、耐受性強、能等待，內在有很深的覺察，適合療癒、諮商與需要沉澱的創作。', '太被動，常用犧牲自己來成全別人、事後又覺得不平衡；明知該做決定卻一拖再拖，甚至說服自己吃苦當吃補，小心拖到來不及轉彎。'],
  13: ['「重生力」強大，敢斷捨離、敢放下不適合的人事物，能在結束中看見開始；不被過去綁住，面對劇變反而比誰都更快進入狀態。', '態度有時太絕對，要結束就一刀兩斷、少了轉圜空間；在關係裡容易顯得突然與冷冽，也可能因常「打掉重來」而讓生活缺乏穩定。'],
  14: ['平衡感極佳，能在不同立場、不同個性之間找到中庸之道；溫和、有耐心、療癒力強，是團體的潤滑劑，擅長協調與整合，四兩撥千斤。', '太想兩邊都顧好，反而顯得不夠果決、立場模糊；常因不想得罪人而稀釋自己真實的想法，久了會讓人想問「你到底站哪邊」。'],
  15: ['對慾望誠實、知道自己要什麼也敢去爭取；魅力強、有商業頭腦，能把「想要」化成實際行動，運用得好能累積可觀的豐盛。', '容易被慾望牽著走，有上癮傾向——可能是物質、感情、工作或手機；容易陷入「明知不對卻離不開」的綁定，需要刻意練習鬆綁。'],
  16: ['敢打破舊框架，不怕改變、不怕砍掉重練；抗壓性高，能在危機中找到生機，常在大破之後迎來大立，衝擊來了也能處之泰然。', '人生起伏較大，容易經歷突如其來的變動；小心因捨不得放手而讓崩塌重複發生，或在情緒衝動時親手推倒好不容易建立的東西。'],
  17: ['有夢想、有願景、有療癒力，是身邊人的「希望製造機」；純粹樂觀、相信美好會發生，適合創作、品牌與自媒體，常莫名獲得指引。', '太理想化，容易忽略現實層面的考量，常常光想不做、以為事情自己會變好；也容易把人想得太美，期待落空時比誰都受傷。'],
  18: ['直覺、想像與感受力都極強，能精準讀出情緒與氛圍，看人很準；有藝術天分與神祕感，適合創作、心理、靈性與文字，也很適合風險管理。', '想太多、容易焦慮，常在事情還沒發生前先把自己嚇壞；容易被情緒帶著走、在迷霧中迷失方向，需要刻意建立「回到現實」的習慣。'],
  19: ['樂觀、自信、有活力，走到哪都能把氣氛帶起來；有魅力、有感染力，很會鼓舞人心，單純好相處、不太計較，是團體裡的啦啦隊。', '有時陽光過了頭，會忽略事情的陰暗面與他人的低潮，顯得少根筋；遇到挫敗時內心其實比外表脆弱，也不容易承認「這次真的不行」。'],
  20: ['覺察力強、有使命感，常聽見「我是不是該做點什麼」的內在召喚；能反省、能轉化，常在某個時刻突然醒來，把人生帶進全新階段。', '容易自我批判，用放大鏡檢視過去的選擇，一直活在「早知道就⋯⋯」裡；偶爾也會用評斷的眼光看別人，需要練習更多接納。'],
  21: ['完整、有大局觀，凡事要收尾、要圓滿才甘心，想法周全、不會半途而廢；能整合各方資源、視野開闊，是「交給他就放心」的類型。', '完美主義是最大課題，對自己與他人的期待都高，沒達到就給自己很大壓力；放不下、不到最後關頭不鬆手，需要練習「夠好就好」。'],
};

function digitSum(value) { return String(value).split('').reduce((total, ch) => total + Number(ch), 0); }

function numerologyPrompt({ result, steps, tone }) {
  const destinyCard = cardForNumber(result.destinyNumber);
  const refLines = result.refs.map((ref) => `${ref}（${cardForNumber(ref).nameZh} ${cardForNumber(ref).nameEn}）`).join('、');
  return `你是一位熟悉塔羅命數與生命靈數的解讀者。請用繁體中文協助我更認識自己；內容請當作反思的參考，不要說成絕對的命定。

我的西元生日：${result.y} 年 ${result.m} 月 ${result.d} 日
計算過程：${steps.join('；')}
塔羅命數：${result.destinyNumber}（${destinyCard.nameZh} ${destinyCard.nameEn}${result.destinyNumber === 22 ? '，加總 22 對應 0 愚人' : ''}）
${refLines ? `同時參考：${refLines}\n` : ''}生命靈數：${result.lifeNumber}

請依序告訴我：
1. 塔羅命數主牌反映的處事態度與決策慣性：優勢與劣勢各自會怎麼出現在我的工作、感情與人際裡（各舉一個具體情境）。
2. ${refLines ? '主牌與同時參考的牌如何交互作用：哪些特質互補、哪些會互相拉扯。' : '這張主牌單獨出現時，最容易被我自己忽略的一面是什麼。'}
3. 生命靈數 ${result.lifeNumber} 的天賦與課題，和塔羅命數合起來看，我最需要留意的一個盲點。
4. 給我 1–3 個小而可執行的日常練習，幫我把優勢用出來、接住劣勢。

最後請用一句話總結「我是什麼樣的人」。

${promptTones[tone] ?? promptTones.溫和}`;
}

function NumerologyPrompt({ result, steps }) {
  const [tone, setTone] = useState('溫和');
  const [copyStatus, setCopyStatus] = useState('');
  const tones = Object.keys(promptTones).filter((item) => item !== '顯化式');
  const prompt = numerologyPrompt({ result, steps, tone });

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus(`已複製「${tone}」語氣的提示詞，可直接貼到 GPT。`);
    } catch {
      setCopyStatus('無法自動複製，請展開預覽手動複製。');
    }
  }

  return <div className="stage-prompt numerology-prompt">
    <div className="stage-prompt__head"><small>GPT 延伸解讀</small><p>選一種語氣，複製提示詞貼到 GPT，讓它把你的命數讀得更深。</p></div>
    <div className="stage-prompt__row">
      <div className="tone-row" role="group" aria-label="解讀語氣">{tones.map((item) => <button type="button" key={item} className={tone === item ? 'tone active' : 'tone'} onClick={() => { setTone(item); setCopyStatus(''); }}>{item}</button>)}</div>
      <button type="button" className="copy-prompt" onClick={copyPrompt}>複製提示詞 ✦</button>
    </div>
    <details className="stage-prompt__preview"><summary>預覽提示詞</summary><textarea readOnly value={prompt} aria-label="可複製的命數解讀提示詞" /></details>
    <span className="stage-prompt__status" aria-live="polite">{copyStatus}</span>
  </div>;
}

function NumerologyPage() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function calculate() {
    const y = Number(year); const m = Number(month); const d = Number(day);
    const date = new Date(y, m - 1, d);
    if (!year || !month || !day || y < 1000 || y > 9999 || date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      setError('請輸入完整且真實存在的西元生日，例如 1998 / 7 / 23。'); setResult(null); return;
    }
    setError('');
    const digits = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    const sums = [digitSum(digits)];
    while (sums[sums.length - 1] > 9) sums.push(digitSum(sums[sums.length - 1]));
    const destinyIndex = sums.findIndex((sum) => sum <= 22);
    setResult({
      digits, sums, y, m, d,
      lifeNumber: sums[sums.length - 1],
      destinyNumber: sums[destinyIndex],
      refs: sums.slice(destinyIndex + 1), // 命數 10 以上要同時參考的後續加總
    });
  }

  const steps = result ? [
    `${result.digits.split('').join(' + ')} = ${result.sums[0]}`,
    ...result.sums.slice(0, -1).map((sum, index) => `${String(sum).split('').join(' + ')} = ${result.sums[index + 1]}`),
  ] : [];

  return <div className="app-grid">
    <MagicPanel className="numerology-panel">
      <p className="panel-kicker">01 · YOUR BIRTH NUMBERS</p><h2>輸入你的西元生日</h2><p className="panel-intro">把生日的每個數字加總，超過 22 就再加總一次——得到的數字對應一張大阿爾克那，就是你的塔羅命數，映照你不自覺的處事態度。繼續歸位到 1–9，則是你的生命靈數。</p>
      <div className="field"><span className="field-label">西元生日</span>
        <div className="birth-row">
          <input inputMode="numeric" maxLength={4} placeholder="1998" aria-label="西元年" value={year} onChange={(event) => setYear(event.target.value.replace(/\D/g, ''))} />
          <span className="unit">/</span>
          <input inputMode="numeric" maxLength={2} placeholder="7" aria-label="月" value={month} onChange={(event) => setMonth(event.target.value.replace(/\D/g, ''))} />
          <span className="unit">/</span>
          <input inputMode="numeric" maxLength={2} placeholder="23" aria-label="日" value={day} onChange={(event) => setDay(event.target.value.replace(/\D/g, ''))} />
        </div>
      </div>
      <div className="actions"><MagicButton className="draw-button" onClick={calculate}>計算生命靈數 <span>✦</span></MagicButton></div>
      {error && <p className="error">{error}</p>}
      {result && <div className="calc-steps" aria-label="計算過程">{steps.map((line) => <div key={line}>{line}</div>)}</div>}
    </MagicPanel>
    <MagicPanel className="numerology-result">
      <p className="panel-kicker">02 · TAROT DESTINY NUMBER</p><h2>{result ? '你的塔羅命數' : '結果會在這裡展開'}</h2>
      {!result && <div className="empty-card"><span>☾</span><b>尚未計算</b><p>在左側輸入生日，你的塔羅命數與生命靈數就會在這裡揭曉。</p><small>TAROT DESTINY NUMBER</small></div>}
      {result && <>
        <div className="destiny-block">
          <div className="destiny-art"><img src={cardForNumber(result.destinyNumber).imageSrc} alt={cardForNumber(result.destinyNumber).nameZh} /></div>
          <div className="destiny-copy">
            <small>塔羅命數 {result.destinyNumber}{result.destinyNumber === 22 ? '（加總 22 對應 0 愚人）' : ''}</small>
            <h3>{cardForNumber(result.destinyNumber).nameZh}<span>{cardForNumber(result.destinyNumber).nameEn}</span></h3>
            <p className="destiny-pro"><b>優勢</b>{destinyMeanings[result.destinyNumber === 22 ? 0 : result.destinyNumber][0]}</p>
            <p className="destiny-con"><b>劣勢</b>{destinyMeanings[result.destinyNumber === 22 ? 0 : result.destinyNumber][1]}</p>
          </div>
        </div>
        {result.refs.length > 0 && <div className="ref-cards">
          <p className="ref-title">命數 {result.destinyNumber} 可以再加總——請同時參考{result.refs.length > 1 ? '這幾張' : '這張'}牌的特質：</p>
          {result.refs.map((ref) => <div className="ref-card" key={ref}>
            <div className="ref-card__art"><img src={cardForNumber(ref).imageSrc} alt={cardForNumber(ref).nameZh} /></div>
            <div className="ref-card__copy">
              <b>{ref} · {cardForNumber(ref).nameZh}</b>
              <p><span>優勢</span>{destinyMeanings[ref === 22 ? 0 : ref][0]}</p>
              <p><span>劣勢</span>{destinyMeanings[ref === 22 ? 0 : ref][1]}</p>
            </div>
          </div>)}
        </div>}
        <div className="life-number life-number--mini"><b>{result.lifeNumber}</b><div><h3>生命靈數 · {numerologyMeanings[result.lifeNumber][0]}</h3><p>{numerologyMeanings[result.lifeNumber][1]}</p></div></div>
        <p className="soul-note">命數反映的是你不自覺的決策方式與處事態度——優勢和劣勢往往是同一件事的兩面，看見了，就能在需要的時候提醒自己調整。</p>
        <NumerologyPrompt result={result} steps={steps} />
      </>}
    </MagicPanel>
  </div>;
}

function MagicButton({ className = '', children, ...props }) {
  return <button type="button" className={`magic-button ${className}`} {...props}>
    <span className="magic-button__shadow" aria-hidden="true" />
    <span className="magic-button__edge" aria-hidden="true" />
    <span className="magic-button__front">{children}</span>
  </button>;
}

function MagicPanel({ className = '', children }) {
  return <section className={`magic-panel ${className}`}>{children}</section>;
}

// GodUI Combobox（searchable: false 模式）移植：取代原生 select 的牌陣選單。
function SpreadSelect({ options, value, disabled, labelledBy, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const triggerRef = useRef(null);
  const selected = options.find((item) => item.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return undefined;
    function closeOnOutside(event) { if (!rootRef.current?.contains(event.target)) setOpen(false); }
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-selected="true"]')?.focus();
  }, [open]);

  function pick(id) { onChange(id); setOpen(false); triggerRef.current?.focus(); }

  function handleListKeyDown(event) {
    const items = [...listRef.current.querySelectorAll('[role="option"]')];
    const index = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') { event.preventDefault(); items[(index + 1) % items.length]?.focus(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); items[(index - 1 + items.length) % items.length]?.focus(); }
    if (event.key === 'Home') { event.preventDefault(); items[0]?.focus(); }
    if (event.key === 'End') { event.preventDefault(); items[items.length - 1]?.focus(); }
    if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    if (event.key === 'Tab') setOpen(false);
  }

  return <div className="spread-select" ref={rootRef}>
    <button type="button" ref={triggerRef} className="spread-select__trigger" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} aria-labelledby={labelledBy} onClick={() => setOpen(!open)} onKeyDown={(event) => { if (event.key === 'ArrowDown' && !open) { event.preventDefault(); setOpen(true); } }}>
      <b>{selected.name}</b>
      <span className="count">{selected.count} 張牌</span>
      <svg className={open ? 'chev is-open' : 'chev'} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {open && <ul className="spread-select__list" role="listbox" aria-labelledby={labelledBy} ref={listRef} onKeyDown={handleListKeyDown}>
      {options.map((item) => <li key={item.id} role="option" tabIndex={-1} aria-selected={item.id === value} onClick={() => pick(item.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pick(item.id); } }}>
        <b>{item.name}</b>
        <span className="count">{item.count} 張牌</span>
        <svg className="check" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
      </li>)}
    </ul>}
  </div>;
}

function ParticleTitle() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frame = 0;
    let particles = [];
    let cancelled = false;

    function setup() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth * ratio;
      const height = canvas.clientHeight * ratio;
      canvas.width = width;
      canvas.height = height;
      const mask = document.createElement('canvas');
      mask.width = width;
      mask.height = height;
      const maskContext = mask.getContext('2d');
      const fontSize = Math.min(height * 0.58, width / 5.05);
      maskContext.fillStyle = '#fff';
      maskContext.font = `800 ${fontSize}px "Noto Sans TC", sans-serif`;
      maskContext.textAlign = 'center';
      maskContext.textBaseline = 'middle';
      maskContext.fillText('神秘塔羅', width / 2, height / 2);
      const image = maskContext.getImageData(0, 0, width, height).data;
      const gap = width < 900 ? 8 * ratio : 6 * ratio;
      particles = [];
      for (let y = gap; y < height - gap; y += gap) {
        for (let x = gap; x < width - gap; x += gap) {
          if (image[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 128) {
            particles.push({ x, y, homeX: x, homeY: y, vx: 0, vy: 0, size: Math.random() > 0.86 ? 1.7 * ratio : 1 * ratio });
          }
        }
      }
    }

    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const pointer = pointerRef.current;
      particles.forEach((particle, index) => {
        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;
          const radius = 84 * Math.min(window.devicePixelRatio || 1, 2);
          if (distance < radius) {
            const force = (radius - distance) / radius;
            particle.vx += (dx / distance) * force * 1.6;
            particle.vy += (dy / distance) * force * 1.6;
          }
        }
        particle.vx += (particle.homeX - particle.x) * 0.026;
        particle.vy += (particle.homeY - particle.y) * 0.026;
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = index % 7 === 0 ? '#f8d982' : index % 3 === 0 ? '#cf9d55' : '#e8bd67';
        context.fill();
      });
      frame = requestAnimationFrame(draw);
    }

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => { if (!cancelled) { setup(); draw(); } });
    const resize = () => { cancelAnimationFrame(frame); setup(); draw(); };
    window.addEventListener('resize', resize);
    return () => { cancelled = true; cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  function movePointer(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = { active: true, x: (event.clientX - rect.left) * (event.currentTarget.width / rect.width), y: (event.clientY - rect.top) * (event.currentTarget.height / rect.height) };
  }

  return <div className="particle-title-wrap"><h1 className="sr-only">神秘塔羅</h1><canvas ref={canvasRef} className="particle-title" onPointerMove={movePointer} onPointerLeave={() => { pointerRef.current.active = false; }} aria-label="可互動的粒子文字：神秘塔羅" /></div>;
}

function TarotCard({ card, revealed, canReveal, index, onReveal, onOpen }) {
  function tiltCard(event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    event.currentTarget.style.setProperty('--tilt-x', `${-y * 9}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 11}deg`);
    event.currentTarget.style.setProperty('--shine-x', `${(x + .5) * 100}%`);
    event.currentTarget.style.setProperty('--shine-y', `${(y + .5) * 100}%`);
  }
  function resetTilt(event) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  }

  const locked = !revealed && !canReveal;
  return <button type="button" className={`tarot-card ${revealed ? 'is-revealed' : ''} ${locked ? 'is-locked' : ''}`} style={{ '--delay': `${index * 120}ms` }} onPointerMove={tiltCard} onPointerLeave={resetTilt} onClick={(event) => (revealed ? onOpen(event) : onReveal(event))} disabled={locked} aria-label={revealed ? `查看${card.position}：${card.nameZh}的大圖與解讀` : locked ? `請先翻開前一張牌，再翻開${card.position}` : `翻開${card.position}`} aria-disabled={locked}>
    <div className="tarot-card__tilt">
      <div className="tarot-card__inner">
        <div className="tarot-card__back"><span className="card-star">✦</span><span>{card.position}</span><small>ARCANA</small></div>
        <div className="tarot-card__front">
          <div className={`card-artwork ${card.isReversed ? 'is-reversed' : ''}`}><img src={card.imageSrc} alt="" /></div>
          <div className="card-overlay">
            <span className="card-position">{card.position}</span>
            <div className="card-overlay__name">
              <h3>{card.nameZh}</h3>
              <span className={card.isReversed ? 'card-orientation reversed' : 'card-orientation'}>{card.isReversed ? '逆位' : '正位'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>;
}

const promptTones = {
  溫和: '語氣請溫柔、具體、鼓勵：先同理我的處境，再慢慢給我提醒與方向，不使用恐嚇或絕對化措辭。',
  犀利: '語氣請直接、犀利、一針見血：直說我可能在逃避或自我安慰的地方，不需要鋪墊與安慰話術，但保持尊重、對事不對人。',
  務實: '語氣請冷靜務實：聚焦現實條件、資源與可執行的步驟，少談抽象感受，多給具體做法與建議的時間點。',
  詩意: '請用詩意的語言回應：以牌面的意象與隱喻寫成一封給我的短信，但結尾仍要落在具體可行的提醒上。',
  顯化式: null, // 顯化式使用獨立的完整模板，見 manifestationPrompt。
};

function manifestationPrompt({ question, spread, cards }) {
  const cardList = cards.map((card) => `- ${card.position}：${card.nameZh}（${card.isReversed ? '逆位' : '正位'}）`).join('\n');
  return `你是一位深諳塔羅的解讀者，請用繁體中文回應。

請幫我用「顯化式、最高版本」來解讀這組塔羅牌。
我的問題是：「${question || '（我尚未填寫，請先引導我把問題說清楚）'}」
使用牌陣：${spread.name}（${spread.positions.join('、')}）
我抽到的牌是：
${cardList || '（我還沒有翻開牌）'}

解讀原則：

* 請保留所有牌，不要只挑好牌，也不要忽略逆位或看似負面的牌。
* 但請把每張牌都解讀成「如果這段關係走向它最成熟、最美好、最高潛力的版本，這張牌會如何展現」。
* 負面牌請著重在「需要經歷、轉化、放下或突破的課題」，不要直接解成失敗或結束。
* 請把所有牌串成一條完整的感情故事線，而不是逐張孤立解牌。
* 特別注意重複出現的牌、同一張牌正逆位的轉變、元素變化，以及前後牌之間的劇情發展。
* 如果出現星星、聖杯二、權杖四、權杖八、寶劍王牌、錢幣十等具有希望、互相、重聚、溝通、推進或穩定含義的牌，請深入說明它們在「最高版本」中如何實現。
* 我想看的不是虛假的保證，而是「這些牌所容許的最美好可能性」。請清楚區分「最高潛力」與「一定會發生」。
* 如果現況有沉默、疏遠、停滯或失衡，請解讀它如何可能成為之後重新整理、看清、恢復雙向關係的轉折點。
* 請特別描述：①目前處在哪個故事階段、②對方可能需要經歷什麼內在轉變、③關係如何從停滯走向流動、④我最適合採取什麼能量與姿態、⑤最美好的結果會長什麼樣子。
* 語氣請溫柔、浪漫、有畫面感，可以像一段感情故事，但不要過度粉飾或宣稱能讀取對方未說出口的事實。

最後請幫我寫兩段：

1. 一段「整組牌的最高版本故事」，像把所有牌串成一篇完整劇情。
2. 一句適合我每天看的顯化肯定句，例如「我不追逐，我接受清楚、主動、真誠、穩定且雙向的愛」。`;
}

function gptPrompt({ question, spread, cards, tone = '溫和' }) {
  if (tone === '顯化式') return manifestationPrompt({ question, spread, cards });
  const cardList = cards.map((card) => `- ${card.position}：${card.nameZh}（${card.isReversed ? '逆位' : '正位'}）｜${card.keywords}`).join('\n');
  return `你是一位深諳塔羅的解讀者。請用繁體中文協助我反思；不要把塔羅說成必然預言，不要替我做醫療、法律、投資或重大人生決定。\n\n我的問題：\n「${question || '（我尚未填寫，請先引導我把問題說清楚）'}」\n\n使用牌陣：${spread.name}\n各位置：${spread.positions.join('、')}\n\n已翻開的牌：\n${cardList || '（我還沒有翻開牌）'}\n\n請依牌陣位置逐張解讀，再整合它們的關聯；指出我可能忽略的盲點，並給我 1–3 個小而可執行的下一步。最後提供 3 個能讓我繼續思考的開放式追問。${promptTones[tone] ?? promptTones.溫和}`;
}

function TarotCardDialog({ card, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = [...document.querySelectorAll('.card-dialog button')].filter((element) => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', handleKeyDown); };
  }, [onClose]);

  const meaning = card.isReversed ? card.reversed : card.upright;
  return <div className="card-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="card-dialog" role="dialog" aria-modal="true" aria-labelledby="card-dialog-title">
      <button type="button" className="dialog-close" onClick={onClose} ref={closeRef} aria-label="關閉牌面大圖">×</button>
      <div className={`dialog-card-art ${card.isReversed ? 'is-reversed' : ''}`}><img src={card.imageSrc} alt={`${card.nameZh}，${card.isReversed ? '逆位' : '正位'}，塔羅牌插畫`} /></div>
      <div className="dialog-overlay">
        <p className="panel-kicker">{card.position} · {card.isReversed ? 'REVERSED' : 'UPRIGHT'}</p>
        <h2 id="card-dialog-title">{card.nameZh}<span className={card.isReversed ? 'card-orientation reversed' : 'card-orientation'}>{card.isReversed ? '逆位' : '正位'}</span></h2>
        <p className="dialog-name-en">{card.nameEn} · {card.keywords}</p>
        <p className="dialog-meaning-text">{meaning}</p>
        <p className="dialog-position-text">{card.position}｜{card.positionMeaning}</p>
      </div>
    </section>
  </div>;
}

function StagePrompt({ question, spread, cards }) {
  const [tone, setTone] = useState('溫和');
  const [copyStatus, setCopyStatus] = useState('');
  const prompt = gptPrompt({ question, spread, cards, tone });

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus(`已複製「${tone}」語氣的提示詞，可直接貼到 GPT。`);
    } catch {
      setCopyStatus('無法自動複製，請展開預覽手動複製。');
    }
  }

  return <div className="stage-prompt">
    <div className="stage-prompt__head"><small>GPT 延伸解讀</small><p>選一種解讀語氣，複製提示詞後貼到 GPT 繼續追問。</p></div>
    <div className="stage-prompt__row">
      <div className="tone-row" role="group" aria-label="解讀語氣">{Object.keys(promptTones).map((item) => <button type="button" key={item} className={tone === item ? 'tone active' : 'tone'} onClick={() => { setTone(item); setCopyStatus(''); }}>{item}</button>)}</div>
      <button type="button" className="copy-prompt" onClick={copyPrompt}>複製提示詞 ✦</button>
    </div>
    <details className="stage-prompt__preview"><summary>預覽提示詞</summary><textarea readOnly value={prompt} aria-label="可複製的 GPT 塔羅解讀提示詞" /></details>
    <span className="stage-prompt__status" aria-live="polite">{copyStatus}</span>
  </div>;
}

// 觸控裝置沒有游標，改用陀螺儀驅動全息箔膜與傾斜：傾斜手機＝轉動手上的閃卡。
// iOS 13+ 規定 requestPermission 必須在使用者手勢中呼叫，所以掛在第一次 pointerdown。
function useGyroHolo(stageRef) {
  const [gyroActive, setGyroActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return undefined;
    if (!window.matchMedia('(pointer: coarse)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    let attached = false;
    let baseline = null;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function handleOrientation(event) {
      if (event.gamma == null || event.beta == null) return;
      if (!baseline) baseline = { beta: event.beta, gamma: event.gamma };
      target.x = Math.max(-0.5, Math.min(0.5, (event.gamma - baseline.gamma) / 30));
      target.y = Math.max(-0.5, Math.min(0.5, (event.beta - baseline.beta) / 30));
    }

    function tick() {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      stageRef.current?.querySelectorAll('.tarot-card').forEach((card) => {
        card.style.setProperty('--tilt-x', `${-current.y * 9}deg`);
        card.style.setProperty('--tilt-y', `${current.x * 11}deg`);
        card.style.setProperty('--shine-x', `${(current.x + 0.5) * 100}%`);
        card.style.setProperty('--shine-y', `${(current.y + 0.5) * 100}%`);
      });
      frame = requestAnimationFrame(tick);
    }

    function attach() {
      if (attached) return;
      attached = true;
      window.addEventListener('deviceorientation', handleOrientation);
      setGyroActive(true);
      frame = requestAnimationFrame(tick);
    }

    function requestOnTap() {
      DeviceOrientationEvent.requestPermission()
        .then((state) => { if (state === 'granted') attach(); })
        .catch(() => {});
      window.removeEventListener('pointerdown', requestOnTap);
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      window.addEventListener('pointerdown', requestOnTap);
    } else {
      attach();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('pointerdown', requestOnTap);
    };
  }, [stageRef]);

  return gyroActive;
}

function ReadingStage({ spread, cards, revealedCards, loading, question, onReveal, onOpen, onBack, headingRef }) {
  const nextIndex = revealedCards.length;
  const stageRef = useRef(null);
  const gyroActive = useGyroHolo(stageRef);
  const visibleCards = cards.filter((card, index) => revealedCards.includes(index));
  const allRevealed = cards.length > 0 && revealedCards.length === cards.length;
  return <section className={`reading-stage ${gyroActive ? 'gyro-active' : ''}`} ref={stageRef} aria-labelledby="reading-stage-title">
    <div className="reading-stage__top"><div><p className="panel-kicker">THE READING · {spread.count} CARDS</p><h1 id="reading-stage-title" ref={headingRef} tabIndex="-1">依照直覺，逐張翻開牌面</h1><p>{spread.name} · {revealedCards.length} / {cards.length} 張已翻開</p></div><button type="button" className="stage-back" onClick={onBack}>回到問題</button></div>
    <p className="stage-instruction" aria-live="polite">{loading ? '牌面正在整理訊息…' : nextIndex < cards.length ? `現在請翻開第 ${nextIndex + 1} 張：${cards[nextIndex].position}` : '所有牌面已展開；可再次點擊任何一張，查看大圖與完整提示詞。'}</p>
    <div className={`spread-layout spread-${spread.id}`}>
      {cards.map((card, index) => <div className={`spread-slot slot-${index + 1} ${index === nextIndex && !loading ? 'is-active' : ''}`} key={`${card.nameZh}-${index}`}>
        <span className="stage-card-label">{card.position}</span>
        <TarotCard card={card} index={index} revealed={revealedCards.includes(index)} canReveal={index === nextIndex && !loading} onReveal={(event) => onReveal(index, event)} onOpen={(event) => onOpen(card, event)} />
      </div>)}
    </div>
    {allRevealed && <StagePrompt question={question} spread={spread} cards={visibleCards} />}
    <p className="stage-disclaimer">這份解讀提供反思與方向，不代替專業醫療、法律或財務建議。</p>
  </section>;
}

export default function App() {
  const [spreadId, setSpreadId] = useState(spreads[0].id);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('感情');
  const [cards, setCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [stageOpen, setStageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState(() => (typeof window !== 'undefined' && window.location.hash === '#numerology' ? 'numerology' : 'tarot'));
  const cardOpenerRef = useRef(null);
  const stageHeadingRef = useRef(null);
  const questionRef = useRef(null);
  const spread = spreads.find((item) => item.id === spreadId) ?? spreads[0];
  const isChoosingCards = cards.length > 0;

  async function draw() {
    if (!question.trim()) { setError('先寫下你想問的事，牌面才知道從哪裡開始。'); return; }
    setError(''); setLoading(true); setRevealedCards([]); setSelectedCard(null);
    const selected = shuffle(deck).slice(0, spread.count).map((card, index) => ({ ...card, position: spread.positions[index], positionMeaning: positionMeaning(spread.id, spread.positions[index]), isReversed: Math.random() < 0.35 }));
    setCards(selected);
    await sleep(520);
    setStageOpen(true); setLoading(false);
  }

  function revealCard(index, event) {
    if (loading || revealedCards.includes(index) || index !== revealedCards.length) return;
    setRevealedCards([...revealedCards, index]);
  }

  function openCard(card, event) { cardOpenerRef.current = event.currentTarget; setSelectedCard(card); }
  function closeCard() { setSelectedCard(null); requestAnimationFrame(() => cardOpenerRef.current?.focus()); }
  function reset() { setQuestion(''); setCards([]); setError(''); setRevealedCards([]); setSelectedCard(null); setStageOpen(false); }
  function returnToSetup() { setCards([]); setError(''); setRevealedCards([]); setSelectedCard(null); setStageOpen(false); requestAnimationFrame(() => questionRef.current?.focus()); }

  useEffect(() => { if (stageOpen) stageHeadingRef.current?.focus(); }, [stageOpen]);

  useEffect(() => {
    function syncView() { setView(window.location.hash === '#numerology' ? 'numerology' : 'tarot'); }
    window.addEventListener('hashchange', syncView);
    return () => window.removeEventListener('hashchange', syncView);
  }, []);

  return <main className="site-shell">
    <div className="star-field" aria-hidden="true" />
    <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
    <nav className="topbar"><a href="#top" className="brand"><span>☾</span> 神秘塔羅</a><div className="nav-tabs"><a href="#tarot" className={view === 'tarot' ? 'active' : ''} aria-current={view === 'tarot' ? 'page' : undefined}>塔羅占卜</a><a href="#numerology" className={view === 'numerology' ? 'active' : ''} aria-current={view === 'numerology' ? 'page' : undefined}>生命靈數</a></div></nav>
    <header className="hero" id="top"><p>{view === 'numerology' ? '認識你的數字' : '給自己的占卜時間'}</p><ParticleTitle /><div className="hero-orbit" aria-hidden="true" /></header>
    {view === 'numerology' && <NumerologyPage />}
    {view === 'tarot' && !stageOpen && <div className="app-grid">
      <MagicPanel className="question-panel">
        <p className="panel-kicker">01 · SET YOUR INTENTION</p><h2>先說說你在意的事</h2><p className="panel-intro">選擇牌陣，然後寫下此刻真正想問的問題。不需要完美，只要誠實。</p>
        <div className="field"><span className="field-label" id="spread-select-label">選擇牌陣</span><SpreadSelect options={spreads} value={spreadId} disabled={loading || isChoosingCards} labelledBy="spread-select-label" onChange={setSpreadId} /></div><div className="spread-detail"><p>{spread.name} · {spread.count} 張牌</p><b>{spread.usage}</b><span>{spread.description}</span><small>抽牌位置：{spread.positions.join(' · ')}</small></div>
        <label>你的問題<textarea ref={questionRef} value={question} disabled={loading || isChoosingCards} onChange={(event) => setQuestion(event.target.value)} placeholder="例如：我接下來三個月最該專注的是什麼？" /></label>
        <div className="actions"><MagicButton className="draw-button" disabled={loading || isChoosingCards} onClick={draw}>{loading ? '正在翻閱牌面…' : '抽牌解讀'} <span>✦</span></MagicButton><button className="reset-button" disabled={loading} onClick={reset}>重設</button></div>
        {error && <p className="error">{error}</p>}
      </MagicPanel>
      <MagicPanel className="template-panel">
        <p className="panel-kicker">02 · FIND YOUR QUESTION</p><h2>從這裡挑一個問題</h2><p className="panel-intro">選一題當起點，或把它改成更貼近你此刻的語氣。</p>
        <div className="question-guide" aria-label="提問小指南"><p>怎麼問，才會更清楚？</p><div>{questionTips.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><b>{title}</b><small>{copy}</small></article>)}</div></div>
        <div className="category-row">{Object.keys(questionGroups).map((item) => <button type="button" disabled={loading || isChoosingCards} className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        <div className="prompt-list">{questionGroups[category].map((item) => <button type="button" disabled={loading || isChoosingCards} onClick={() => { setQuestion(item); questionRef.current?.focus(); }} key={item}>{item}<span>↗</span></button>)}</div>
      </MagicPanel>
    </div>}
    {view === 'tarot' && stageOpen && <ReadingStage spread={spread} cards={cards} revealedCards={revealedCards} loading={loading} question={question} onReveal={revealCard} onOpen={openCard} onBack={returnToSetup} headingRef={stageHeadingRef} />}
    {view === 'tarot' && selectedCard && <TarotCardDialog card={selectedCard} onClose={closeCard} />}
  </main>;
}
