import { useEffect, useRef, useState } from 'react';

const spreads = [
  { id: 'timeline', name: '時間之流', count: 3, positions: ['過去', '現在', '未來'], description: '看見一件事如何走到此刻，以及接下來可能的走向。', usage: '適合：想整理事件脈絡、了解目前狀態與近期方向。' },
  { id: 'holy-triangle', name: '聖三角牌陣', count: 3, positions: ['我以為的狀態', '真實的狀態', '建言'], description: '從認知與真實的落差中，看見尚未注意到的盲點。', usage: '適合：感到卡關、想釐清事件真相或自己忽略了什麼。' },
  { id: 'core', name: '直指核心', count: 4, positions: ['問題核心', '障礙', '對策', '優勢'], description: '把困住你的關鍵、可用資源與下一步放在同一張圖裡。', usage: '適合：某件事一直沒有起色，想知道原因與能做的事。' },
  { id: 'choice', name: '二選一與可能結果', count: 5, positions: ['選項 A 的狀態', '選項 B 的狀態', 'A 可能結果', 'B 可能結果', '我的狀態'], description: '比較兩個方向各自的條件與可能發展，協助你做判斷。', usage: '適合：工作機會、學習方向等具體選擇；不是替你決定。' },
  { id: 'love', name: '感情萬用牌陣', count: 5, positions: ['我的狀態', '我對關係的態度', '對方的狀態', '對方對關係的態度', '可能結果'], description: '梳理關係中的互動與態度，將結果視為會隨選擇改變的可能性。', usage: '適合：想理解一段關係當下的互動，以及如何更好地回應。' },
  { id: 'free-1', name: '無牌陣 · 單抽', count: 1, positions: ['第 1 張'], description: '一問一答，最純粹的抽法——這張牌就是解答。', usage: '適合：問題非常聚焦、只想要一個直接的指引；問題越精準，答案越清楚。' },
  { id: 'free-3', name: '無牌陣 · 三張', count: 3, positions: ['第 1 張', '第 2 張', '第 3 張'], description: '沒有位置框架，三張牌像幻燈片連續播放，看事件如何演進。', usage: '適合：想看一件事的前因後果與走向；問題中可以先設定時間範圍。' },
  { id: 'free-5', name: '無牌陣 · 五張', count: 5, positions: ['第 1 張', '第 2 張', '第 3 張', '第 4 張', '第 5 張'], description: '看圖說故事的自由解讀，從正逆位、大小牌與元素分布找出主軸。', usage: '適合：想要完整脈絡的提問；建議對牌意有基本熟悉再使用。' },
];

const flatQuestionGroups = {
  金錢: ['我目前和金錢的關係，最需要被看見的是什麼？', '我對安全感的擔心，正在怎麼影響我的選擇？', '我可以從哪裡更善用現有的資源？', '我想提升收入，下一步最值得投入的是什麼？', '我在哪個消費習慣裡，最需要停下來覺察？', '我對「值得擁有更多」的信念，需要怎麼調整？', '我想建立更穩定的金錢節奏，可以先做什麼？', '這個階段的金錢課題，想教會我什麼？'],
  人際: ['我在這段關係中，真正想被理解的是什麼？', '我可以怎麼說清楚自己的界線？', '我總是過度付出的模式，從哪裡開始調整？', '這段友誼目前最需要被好好溝通的是什麼？', '我在團體裡感到格格不入，這份感受想提醒我什麼？', '我可以怎麼更自在地接受別人的支持？', '我與家人的互動中，最需要被看見的需求是什麼？', '這段關係裡，我該收回哪一部分的勉強？'],
};

// 感情與工作題庫來源：珊妮療癒所（sannie.tw）。
const scenarioQuestionGroups = {
  感情: {
    單身: ['現階段的我，對談感情的態度是什麼？', '我已準備好走入感情關係了嗎？', '在談感情這件事，讓我單身的原因是什麼？', '過往是什麼創傷或遺憾，導致我尚未碰到適合的對象？', '原生家庭對我找對象這件事，產生什麼樣的影響？而我可以如何改變現況？', '我期待的另一半是什麼樣子？是否包含我個人的投射？', '真正適合我的對象是什麼樣的人？', '接下來我可以做些什麼改變，好讓適合的對象有機會靠近我？', '若遇到適合的對象，可能會有什麼 sign？'],
    曖昧中: ['在他眼中，我們目前的關係是什麼模樣？', '他想到我的時候，腦海中會浮現什麼畫面？', '在他的世界裡，我目前正站在什麼樣的位置？', '如果這段關係是一顆種子，它現在最缺的養分是什麼？', '我們之間現在的關係氣氛，正在朝哪個方向流動？', '這段關係裡，雙方沒有說出口的真實，各自是什麼？', '在我們之間，有什麼是我明明知道卻下意識忽視的訊號？', '是什麼讓這段關係還卡在曖昧、沒有往前走？', '在這段關係裡，有哪些恐懼是我自己都沒有承認的？', '我可以展現什麼樣的自己，讓彼此靠得更近一點？', '現在這個時機，我適合主動嗎？若適合，怎麼做最自然？', '什麼樣的一個行動或對話，能讓這段曖昧有個方向？'],
    單戀中: ['在這份喜歡的背後，我真正渴望的是什麼？', '這段感情讓我感覺最好的部分，是哪一個瞬間或狀態？', '我對他的感覺，到底是什麼？', '他出現在我的生命裡，是為了讓我看見或學會什麼？', '我最喜歡他哪個特質？那是否示意著我渴望那個特質？', '在對方眼中的我，會是什麼樣子？', '如果繼續等下去，我會得到什麼、又會失去什麼？', '在這段單戀裡，我是如何展現自己的？是否保持了最好的狀態與距離？', '如果你是我最好的朋友，你會給我什麼感情建議？', '我該如何將這份喜歡慢慢轉回到自己身上？', '放下這段感情之後，我會獲得什麼？', '採取什麼樣的行動，會讓我重新感受到自己的魅力？'],
    穩交婚後: ['我們現在這段關係，正站在什麼轉折點上？', '未來這一年，我們的關係核心主題是什麼？', '我們兩個人一起，正在往哪個方向成長？', '在日常生活中，我們最容易遺忘對彼此的哪種感激？', '在這段關係裡，我最常在什麼地方對對方不公平？', '對方或我自己，最近想讓彼此感受到、卻沒說出口的是什麼？', '我可以做什麼，讓對方再一次感受到愛？', '我們的「深度交流」現在是什麼狀態？那種感覺要怎麼找回來？', '這段關係裡，有什麼是我一直想做、但一直沒開口的？', '若要成為更好的伴侶，我需要在這段關係中學習什麼？', '哪個在關係中的習慣或模式，是時候放下了？', '若這段關係是一面鏡子，它照出的是我的哪個樣子？而我喜歡嗎？'],
    關係生變: ['這場爭執背後，彼此真正的恐懼與渴望是什麼？', '衝突的核心問題是什麼？為什麼我們忽略了它？', '在這場衝突裡，我說錯了什麼？或有什麼沒說出口？', '我們之間的困境或陰影，是什麼造成的？', '若我要先開口做些什麼，我該表達什麼？結果會如何？', '如果什麼都不做，這段關係半年後會如何？', '會是什麼樣的契機，能讓現在緊繃的氣氛稍微鬆動？', '若對方想跟我說一件事，那可能是什麼？', '如果我選擇繼續，我需要做什麼改變？', '如果我選擇放手，我會獲得什麼、失去什麼？', '關於這段關係，我的靈魂現在最想要的結果是什麼？', '在這個時間點，採取什麼樣的決定會讓我最舒服？'],
    分手復合: ['這段關係的結束，是為了帶給我什麼禮物？', '在這段感情裡，我從來沒有好好看見的部分是什麼？', '這段關係的結束，正在保護我什麼嗎？', '我的內心現在最需要什麼？', '現在的我，身體最需要什麼樣的滋養？', '在悲傷之中，有什麼是我還沒有對自己誠實的底層感受？', '如果有一天我們再次相遇，那時的我們會是什麼樣子？', '是什麼條件、機會或改變，能讓這段關係再一次重新開始？', '如果復合，我們該在哪一個相處環節中做出改變？', '若我想要爭取復合，我該做些什麼？', '復合後會帶給我什麼？關係接下來的走向如何？', '現在對我來說，最能給予我力量的行動是什麼？', '如果我選擇好好放下，未來的感情生活會長什麼樣子？', '這段經歷最終想送給我的禮物是什麼？'],
  },
  工作: {
    職涯迷茫: ['我現在對工作的感覺，最接近哪種狀態？', '在我的職涯裡，什麼曾經讓我真正感到有活力？我該怎麼找回來？', '我說「不知道自己要什麼」，但如果誠實一點，我其實隱約知道什麼？', '在工作這件事上，我渴望什麼？', '我害怕找到方向之後，會失去什麼嗎？', '什麼樣的工作狀態，會讓我覺得這一天心滿意足？', '是什麼讓我一直停在原地、沒有往前走？', '在我的成長背景或過去經歷裡，是什麼一直在限制我對自己的想像？', '現在的我，最需要的是等待還是行動？', '現在的我，該採取什麼行動，好讓自己能安心？', '如果我給自己一個月去探索，我最該嘗試做什麼？'],
    離職評估: ['想離開的念頭，是因為什麼事情才開始出現的？它在告訴我什麼？', '我想離開的，是這份工作本身、我現在的狀態，還是環境與人的原因？', '我在工作中最想獲得的是什麼？', '這份工作裡，還有什麼是我還能學的？', '如果我選擇再待一年，會有什麼結果？', '如果我現在離開，我該做些什麼準備？', '若離開，我會帶走什麼禮物？', '我還未準備好的部分是什麼？是我的恐懼還是什麼不足？', '離開之後，我理想中的工作新篇章長什麼模樣？', '高我期待我在這份工作達到什麼樣的成果？', '現在是離開的好時機嗎？如果不是，什麼訊號出現才是？'],
    職場關係: ['這段職場關係裡，讓我最內耗的部分是什麼？', '和ＯＯ相處的過程，最讓我不舒服的點是什麼？為什麼我在意這個？', '這段關係裡，我沒說出口的真話是什麼？', '對方在這段職場關係中，真正想要的是什麼？', '他的行為背後，有沒有什麼是我還沒看見的動機？', '他對我的真實看法是什麼？', '我可以做什麼，讓這段職場關係不再那麼耗能？', '在這個環境裡，我能保護自己能量的最好方式是什麼？', '如果我選擇不做任何改變，會怎麼樣？而我需要接受什麼？', '這個人或這個環境，對我的成長是養分還是消耗？', '繼續留在這個團隊，我的狀態半年後會在哪裡？'],
    創業斜槓: ['現在的我，已經準備好的是什麼？還在缺的是什麼？', '我對創業或斜槓的熱情，是穩定的火焰還是一時的衝動？', '在創業這件事上，我最怕失敗的是什麼？是錢、是面子，還是怕證明自己真的不行？', '我最適合往哪個方向創業或斜槓，才能展現我的獨特性？', '有什麼事情是只有我能解決、其他人做不到的嗎？', '我想服務的對象是誰？他們真正的痛點是什麼？我解決了嗎？', '在我身邊，有什麼資源是我還沒有善用的？', '誰是我在這條路上最需要的支持，我有沒有開口？', '現在我能投入的第一步是什麼？', '什麼樣的行動，會讓我損失最小？', '採取行動後，我可能要犧牲什麼？但我會獲得什麼？'],
    升遷機會: ['這時候出現的機會，對我來說代表什麼？', '這個新職位或新合作，能幫助我的是什麼？真正吸引我的是什麼？', '這個吸引力能為我帶來什麼好處？', '如果我接受，會有什麼結果？若拒絕，會有什麼結果？', '我目前具備了這個機會所需要的什麼能力？還有什麼需要快速補上？', '在這個新角色裡，我最可能遇到的挑戰是什麼？我能預先做什麼準備？', '我在猶豫的部分，是理性的風險評估，還是自我懷疑？', '如果我拒絕這個機會，會有什麼優點與缺點？', '關於這個機會，是否有其他競爭對手？對方比我強的點是什麼？', '如果我接受，三個月後的我會面對什麼樣的局面？', '不管最後的選擇是什麼，我需要先想清楚的是什麼？'],
    生活平衡: ['現階段的工作狀態，帶給我什麼感受？', '目前的工作狀態，正在對我表達什麼？', '我說「我很忙」的背後，代表我正在逃避什麼嗎？', '在工作以外，我能用什麼方法讓自己放鬆舒壓？', '目前的工作強度、內容、方向，適合我嗎？讓我感到舒服嗎？', '現在的位置是我真正想要的嗎？', '如果工作只是生活的一部分，我還想要的其他部分是什麼？', '我現在的努力，是在為誰而做？', '我是否正在發揮自己的價值？我有成就感嗎？', '我的潛力是什麼？這份工作有讓我發揮潛力的空間嗎？', '我的能量現在最需要什麼補給？', '什麼是我可以放下、但一直不肯放的？', '我緊抓著那個不肯放下的，原因是什麼？我到底想獲得什麼？', '半年後，我希望工作和生活變成什麼樣子？', '採取什麼樣的改變，能讓我同時在工作上有成果、生活上也不委屈自己？'],
  },
  自我: {
    情緒感受: ['有哪個瞬間，我假裝沒事，但其實有感覺？', '最近讓我最煩的事，如果用一個顏色來形容，那是？', '我有多久沒有問自己「我今天怎麼樣」了？', '什麼事情讓我一想到就會胸口悶？', '我上一次真的開心，是什麼時候？是因為什麼？', '我習慣性地壓下去、不讓自己感覺的情緒是什麼？', '當我說「沒關係」的時候，有哪次其實是有關係的？', '如果我的身體現在是一個天氣，是什麼天氣？', '哪件事是我嘴巴說不在乎，但身體會緊繃？', '如果今天的情緒是一張塔羅牌，那會是哪張？'],
    信念價值: ['有沒有一句話或信念，是我從小被灌輸、但長大後開始懷疑的？', '我對「成功」的定義，如果用一個畫面來描述，那是什麼樣子？', '什麼事情讓我覺得「這不該這樣」？而這個「應該」是誰說的？', '有沒有某件事，我做了很久，但從來沒問過自己為什麼要做？', '如果沒有人評價我，我會做出什麼選擇？', '讓我感到安全、但同時也讓我受困的信念，是什麼？', '我最害怕被人說「你是一個＿＿的人」，那個空格我會填什麼？', '「夠好了」對我來說長什麼樣子？我允許自己到達嗎？', '如果我的某個核心信念是一棟建築，它堅固還是快倒了？', '如果我只能守護一個價值觀，我會選什麼？'],
    關係連結: ['在我生命中，有沒有一段關係讓我覺得「我不能真實做自己」？', '我在關係裡，比較習慣付出還是接受？蹺蹺板現在傾向哪邊？', '當我需要幫助的時候，我能夠輕鬆開口嗎？什麼讓我說不出口？', '有沒有一段關係，我一直在等對方改變？等了多久了？', '如果我現在最重要的一段關係是一種植物，它現在的狀態是什麼？', '當我在關係中感到委屈，我通常怎麼對待那個委屈的自己？', '有沒有人讓我有一句話想對他說，但一直沒有說？', '「被愛」對我來說是什麼感覺？我現在有這種感覺嗎？', '我在關係中最常扮演的角色，如果是一張塔羅牌，會是哪張？', '如果可以重新設定一段關係，我最想改變什麼？'],
    慾望渴望: ['有沒有某件事，我告訴自己「太奢侈了」而放棄，但其實忘不了？', '如果我知道不會失敗，我最想做的一件事是什麼？', '我上一次為自己做「純粹只是想要」的事，是什麼時候？', '有沒有某個渴望，讓我自己也覺得羞愧或不應該有？', '我現在的生活，如果用一杯飲料來形容，是我想喝的那杯嗎？', '五年後的我回來看現在，最希望現在的我去追尋的是什麼？', '有沒有某個夢想，我放在心裡很久，但從來沒跟任何人說過？', '做什麼事情時，讓我感覺「這就是我的本色展現」？', '我允許自己渴望嗎？還是更習慣說服自己「這樣就夠了」？', '如果有人全力支持我做任何事，我的第一個念頭是什麼？'],
    恐懼陰影: ['我現在最不想面對的一件事，如果那是一個房間，我願意打開門嗎？', '有沒有某個情境，讓我一想到就想逃？', '我最害怕被別人發現我其實是一個怎樣的人？', '我有沒有某個「壞習慣」，其實是在保護我不去感受某些事？', '如果我不再假裝某件事沒問題，我需要面對什麼？', '我內心最常批評自己的那句話是什麼？它的聲音像誰？', '有沒有某件失敗或錯誤，我到現在還沒有原諒自己？', '我害怕孤獨，還是害怕太靠近別人？還是兩個都怕？', '如果我的恐懼是一種動物，它是什麼動物？牠現在在做什麼？', '有沒有某件事，我一直用「我沒時間」拖延，但其實是因為怕？'],
    身份認同: ['如果拿掉我所有的頭銜和角色，剩下的那個人是什麼樣子？', '有沒有某個形象，是我一直在努力維持但其實很累的？', '別人眼中的我，跟我感覺的我，差距有多大？零到十分怎麼打？', '我現在正在經歷什麼樣的人生轉換？如果是一個季節，是哪個季節？', '有沒有某個版本的自己，是我很久沒有讓他出現的？他現在在哪裡？', '我最不想讓別人看到我哪一面？', '我覺得自己「夠格」做哪些事？「不夠格」做哪些事？那個標準怎麼來的？', '如果真實的我是一張塔羅牌，那會是哪張？', '有沒有某個時刻，我覺得自己終於活出了自己？那時發生了什麼？', '十年後的我，希望現在的自己記得什麼？'],
    目的意義: ['什麼事情讓我做完之後，覺得「這超級值得」——無論結果成不成功？', '如果我的人生是一本書，現在這個章節的標題是什麼？', '有沒有什麼事，是我覺得「非我不可、捨我其誰」的？', '用什麼方式幫助別人時，會讓我有意義感？', '如果我知道今年是我的最後一年，我會把時間用在哪裡？', '什麼事情讓我即使很累，還是願意繼續做？', '如果我的人生使命是一個氣味，那會是什麼氣味？', '有沒有某件事，我一直說「有一天要去做」，但一直沒有開始？', '什麼樣的生活讓我覺得不虛此行？用一個畫面來描述？', '如果我的人生有一個核心主題，那張牌是什麼？'],
    行動改變: ['有沒有某件事，我「知道要做」但一直沒做，已經多久了？', '當我說「我沒辦法」，是真的沒辦法，還是不願意付那個代價？', '我改變的最大阻力，如果是一種材質，是什麼？', '如果明天就要開始改變，我最擔心失去什麼？', '我在等的那個「完美時機」，如果誠實說，它真的存在嗎？', '上一次我做了為自己驕傲的決定，是什麼？那次是什麼給了我勇氣？', '有沒有某個「早就該放手」的事，我還在抓著？放手後的模樣是什麼？', '如果「現在的我」跟「想要改變的我」是兩張塔羅牌，各會是哪張？', '我需要什麼條件才能踏出第一步？那是真實的門檻，還是藉口？', '三個月後，我希望自己說「還好我當時＿＿」，那個空格是什麼？'],
  },
};

const questionCategories = ['感情', '工作', '金錢', '人際', '自我'];

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
    'free-1': { '第 1 張': '一問一答：這張牌就是你的問題最直接的回應。' },
    'free-3': { '第 1 張': '故事的開端——事件的前因。', '第 2 張': '中段的發展與轉折。', '第 3 張': '順著這個勢頭走的可能結局。' },
    'free-5': { '第 1 張': '訊息的開場。', '第 2 張': '第二幕：事件開始發展。', '第 3 張': '故事的中心——留意主軸牌是否在這裡。', '第 4 張': '第四幕：轉折與變化。', '第 5 張': '收尾的方向。' },
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

// 13 月亮曆（Dreamspell）：20 太陽圖騰 [顏色, 名稱, 特質]。
const mayaSeals = [
  ['紅', '龍', '創始與滋養的能量，帶著開創與照顧族人的本能，適合當開路的人。'],
  ['白', '風', '傳遞訊息的風，重視溝通、語言與靈感——把想法說出去就是你的天賦。'],
  ['藍', '夜', '夢想家與直覺者，內在有豐盛的夢境世界，擅長把夢化成藍圖。'],
  ['黃', '種子', '耐心的播種者，相信時間的力量，擅長讓想法慢慢發芽長成。'],
  ['紅', '蛇', '身體智慧與生命力，本能敏銳、熱情有爆發力，記得傾聽身體的訊號。'],
  ['白', '世界橋', '天生的橋樑與連結者，擅長放下與斷捨離，串起不同世界的人事物。'],
  ['藍', '手', '療癒與完成之手，動手做就是你的魔法，透過實作把事情帶到完成。'],
  ['黃', '星星', '美與藝術的化身，對美感敏銳，把生活過成作品就是你的使命。'],
  ['紅', '月', '淨化的水，情感豐沛、感受力強，像月光一樣療癒身邊的人。'],
  ['白', '狗', '忠誠與愛，重情重義，用真心對待世界，也記得先愛自己。'],
  ['藍', '猴', '遊戲與幽默的魔法師，用玩心破解嚴肅，提醒大家人生是一場遊戲。'],
  ['黃', '人', '自由意志的智者，重視選擇與自主，用智慧與影響力引導他人。'],
  ['紅', '天行者', '探索空間的旅人，不安於室、勇於冒險，把未知走成道路。'],
  ['白', '巫師', '魅力與魔法的容器，直覺與專注是你的法器，能接收宇宙的訊息。'],
  ['藍', '鷹', '高空的視野，擅長看見全局與未來，為身邊的人給出方向感。'],
  ['黃', '戰士', '無畏的提問者，敢挑戰權威與框架，用理性與勇氣開路。'],
  ['紅', '地球', '與地球共振的導航者，重視腳踏實地與同步性，跟著徵兆走。'],
  ['白', '鏡', '真相之鏡，誠實映照自己與他人，清晰就是你的力量。'],
  ['藍', '風暴', '蛻變的催化劑，天生帶著改變的能量，在轉化中一次次重生。'],
  ['黃', '太陽', '無條件的愛與照耀，天生的光源，溫暖並啟發身邊的每個人。'],
];

// 13 銀河音階 [名稱, 課題]。
const mayaTones = [
  ['磁性', '吸引目的——常問自己「我的目的是什麼」，目標清楚能量就會聚攏。'],
  ['月亮', '面對挑戰——在二元的擺盪中練習穩定，挑戰就是你的養分。'],
  ['電力', '啟動服務——把能量用在對的地方，行動就會帶電。'],
  ['自我存在', '定義形式——把想法整理出形狀，你需要自己的方法與空間。'],
  ['超頻', '綻放光芒——授權自己站上舞台，你的存在本身就有力量。'],
  ['韻律', '組織平衡——在生活中找到自己的節奏，平衡是動態的。'],
  ['共振', '調頻歸位——先回到中心，再帶著頻率影響環境。'],
  ['銀河星系', '活出誠信——讓你相信的與你做出來的一致。'],
  ['太陽', '完成意圖——把脈動化為實現，你有把事情帶到終點的力量。'],
  ['行星', '顯化完美——把成果做到位，你是天生的顯化者。'],
  ['光譜', '釋放消融——學會放手與解構，鬆開才有新的空間。'],
  ['水晶', '合作奉獻——在群體中貢獻你的清晰，一起完成比獨自完成更遠。'],
  ['宇宙', '超越當下——帶著整趟旅程回到存在本身，享受就是完成。'],
];

// Dreamspell 錨點：2013-07-26 = Kin 164（黃銀河星系種子）；閏日 2/29 不計數。
function mayaKin(y, m, d) {
  const anchor = Date.UTC(2013, 6, 26);
  const target = Date.UTC(y, m - 1, d);
  const step = target >= anchor ? 86400000 : -86400000;
  let delta = 0;
  for (let t = anchor; t !== target; t += step) {
    const next = new Date(t + step);
    if (!(next.getUTCMonth() === 1 && next.getUTCDate() === 29)) delta += step > 0 ? 1 : -1;
  }
  return ((163 + delta) % 260 + 260) % 260 + 1;
}

function mayaProfile(y, m, d) {
  const kin = mayaKin(y, m, d);
  const sealIndex = (kin - 1) % 20;
  const toneIndex = (kin - 1) % 13;
  const wavespellSeal = mayaSeals[(kin - 1 - toneIndex) % 20];
  const [color, seal, sealMeaning] = mayaSeals[sealIndex];
  const [tone, toneMeaning] = mayaTones[toneIndex];
  return {
    kin, color, seal, sealMeaning, tone, toneMeaning,
    toneNumber: toneIndex + 1,
    fullName: `${color}${tone}${seal}`,
    wavespell: `${wavespellSeal[0]}${wavespellSeal[1]}波符`,
    isLeapBirthday: m === 2 && d === 29,
  };
}

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
馬雅曆（13 月亮曆）：KIN ${result.maya.kin} · ${result.maya.fullName}（${result.maya.wavespell}）

請依序告訴我：
1. 塔羅命數主牌反映的處事態度與決策慣性：優勢與劣勢各自會怎麼出現在我的工作、感情與人際裡（各舉一個具體情境）。
2. ${refLines ? '主牌與同時參考的牌如何交互作用：哪些特質互補、哪些會互相拉扯。' : '這張主牌單獨出現時，最容易被我自己忽略的一面是什麼。'}
3. 生命靈數 ${result.lifeNumber} 的天賦與課題，和塔羅命數合起來看，我最需要留意的一個盲點。
4. 我的馬雅主印記（圖騰、音階與波符）補充了哪些命數沒說到的面向？和塔羅命數有沒有互相呼應或互補的主題？
5. 綜合以上三套系統，給我 1–3 個小而可執行的日常練習，幫我把優勢用出來、接住劣勢。

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
      maya: mayaProfile(y, m, d),
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
        <div className="maya-block">
          <small className="maya-kicker">13 MOON · MAYAN KIN</small>
          <div className="maya-kin">
            <span className={`maya-chip maya-chip--${result.maya.color === '紅' ? 'red' : result.maya.color === '白' ? 'white' : result.maya.color === '藍' ? 'blue' : 'yellow'}`}>KIN {result.maya.kin}</span>
            <b>{result.maya.fullName}</b>
            <span className="maya-ws">{result.maya.wavespell}</span>
          </div>
          <p className="maya-copy"><b>圖騰 · {result.maya.color}{result.maya.seal}</b>{result.maya.sealMeaning}</p>
          <p className="maya-copy"><b>音階 {result.maya.toneNumber} · {result.maya.tone}</b>{result.maya.toneMeaning}</p>
          {result.maya.isLeapBirthday && <p className="maya-copy maya-leap">2/29 出生在 13 月亮曆中是曆法之外的「無時間之日」，這裡以 2/28 的 Kin 作為參考。</p>}
        </div>
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

// 無牌陣提示詞：不套位置，改用「串故事、正逆位比例、大牌主軸、元素分布」的自由解讀原則。
function freeFormPrompt({ question, spread, cards, tone }) {
  const cardList = cards.map((card, index) => `${index + 1}. ${card.nameZh}（${card.isReversed ? '逆位' : '正位'}）｜${card.keywords}`).join('\n');
  const principles = spread.count === 1
    ? `* 這張牌就是我的問題最直接的回應，請直接就牌意回答，不要繞。
* 若是逆位：請拆成兩部分說明——①現況或預測（這個逆位反映了什麼）、②建議（如何把這張牌調回正位的能量，給我一個能實踐的做法）。
* 若是正位：說明牌義如何回應我的問題之後，也給我一個可以帶走執行的小行動。`
    : `* 不要套用固定牌陣的位置意義。請把這 ${spread.count} 張牌當成從左到右連續播放的幻燈片，讀出事件的演進與前因後果，把所有牌串成一段完整的故事，而不是逐張分開翻譯。
* 觀察正位與逆位的比例：逆位偏多代表過程容易受阻。請指出阻礙分別是哪幾張牌、各代表什麼，並針對每張逆位牌給出「調回正位能量」的具體建議。
* 留意大阿爾克那與小阿爾克那的數量：若有大牌，請把能量最強的那張視為整個牌面的主軸，優先圍繞它展開故事。
* 觀察四元素的分布（權杖＝火、聖杯＝水、寶劍＝風、錢幣＝土）：若某個元素特別多或完全缺席，說明這反映了我什麼樣的狀態或特質。
* 最後請收攏成三件事：①一段完整的現況與走向的故事、②我最需要留意的一件事、③1–2 個可以帶走執行的具體行動。`;
  return `你是一位深諳塔羅的解讀者。請用繁體中文協助我反思；不要把塔羅說成必然預言，不要替我做醫療、法律、投資或重大人生決定。

我的問題：
「${question || '（我尚未填寫，請先引導我把問題說清楚）'}」

這次不使用固定牌陣（無牌陣），共 ${spread.count} 張牌，依抽出順序排列：
${cardList || '（我還沒有翻開牌）'}

無牌陣解讀原則：
${principles}

${promptTones[tone] ?? promptTones.溫和}`;
}

function gptPrompt({ question, spread, cards, tone = '溫和' }) {
  if (tone === '顯化式') return manifestationPrompt({ question, spread, cards });
  if (spread.id.startsWith('free-')) return freeFormPrompt({ question, spread, cards, tone });
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
    <p className="stage-instruction" aria-live="polite">{loading ? '牌面正在整理訊息…' : nextIndex < cards.length ? `現在請翻開第 ${nextIndex + 1} 張${cards[nextIndex].position.startsWith('第') ? '' : `：${cards[nextIndex].position}`}` : '所有牌面已展開；可再次點擊任何一張，查看大圖與完整提示詞。'}</p>
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
  const [scene, setScene] = useState('單身');
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
        <div className="category-row">{questionCategories.map((item) => <button type="button" disabled={loading || isChoosingCards} className={category === item ? 'category active' : 'category'} onClick={() => { setCategory(item); if (scenarioQuestionGroups[item]) setScene(Object.keys(scenarioQuestionGroups[item])[0]); }} key={item}>{item}</button>)}</div>
        {scenarioQuestionGroups[category] && <div className="subcategory-row">{Object.keys(scenarioQuestionGroups[category]).map((item) => <button type="button" disabled={loading || isChoosingCards} className={scene === item ? 'subcat active' : 'subcat'} onClick={() => setScene(item)} key={item}>{item}</button>)}</div>}
        <div className="prompt-list">{(scenarioQuestionGroups[category] ? scenarioQuestionGroups[category][scene] ?? [] : flatQuestionGroups[category]).map((item) => <button type="button" disabled={loading || isChoosingCards} onClick={() => { setQuestion(item); questionRef.current?.focus(); }} key={item}>{item}<span>↗</span></button>)}</div>
        {scenarioQuestionGroups[category] && <p className="question-credit">{category}題庫來源：<a href="https://sannie.tw/" target="_blank" rel="noreferrer">珊妮療癒所</a></p>}
      </MagicPanel>
    </div>}
    {view === 'tarot' && stageOpen && <ReadingStage spread={spread} cards={cards} revealedCards={revealedCards} loading={loading} question={question} onReveal={revealCard} onOpen={openCard} onBack={returnToSetup} headingRef={stageHeadingRef} />}
    {view === 'tarot' && selectedCard && <TarotCardDialog card={selectedCard} onClose={closeCard} />}
  </main>;
}
