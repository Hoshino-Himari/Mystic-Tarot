import { useEffect, useRef, useState } from 'react';

const spreads = [
  { id: 'single', name: '單張指引', count: 1, positions: ['核心訊息'], description: '適合快速確認目前最重要的提醒。' },
  { id: 'timeline', name: '過去／現在／近期未來', count: 3, positions: ['過去脈絡', '當下狀態', '近期未來'], description: '適合用時間軸理解事情如何走到現在。' },
  { id: 'choice', name: '兩難抉擇', count: 3, positions: ['選項 A', '選項 B', '整體建議'], description: '適合在兩個方向之間做判斷。' },
  { id: 'relationship', name: '關係透視', count: 3, positions: ['我的狀態', '對方的狀態', '關係建議'], description: '適合釐清關係中的互動、期待與下一步。' },
  { id: 'career', name: '職涯導航', count: 3, positions: ['目前優勢', '關鍵阻礙', '行動方向'], description: '適合整理工作、學業或創作上的突破口。' },
  { id: 'inner', name: '內在對話', count: 3, positions: ['表層感受', '深層需求', '溫柔提醒'], description: '適合在混亂時回到自己，辨認真正的需要。' },
  { id: 'cross', name: '五芒星指引', count: 5, positions: ['此刻核心', '正在支持你', '需要放下', '下一步', '整體訊息'], description: '適合想更全面梳理一件重要事情時使用。' },
];

const questionGroups = {
  感情: ['這段關係現在真正的核心是什麼？', '我該繼續等待，還是把重心拉回自己身上？', '這段關係接下來幾個月可能怎麼發展？'],
  工作: ['我在工作上卡住的真正原因是什麼？', '我該留在現在的環境，還是開始準備轉換？', '如果我想提升收入，最聰明的第一步是什麼？'],
  自我: ['我現在最需要放下的內在模式是什麼？', '在焦慮底下，我真正害怕的是什麼？', '我該如何重新建立更健康的節奏與界線？'],
};

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
].map(([nameZh, nameEn, keywords, upright, reversed]) => ({ nameZh, nameEn, keywords, upright, reversed, arcana: '大阿爾克那' }));

const minorRanks = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍者', '騎士', '皇后', '國王'];
const suitDetails = {
  權杖: ['行動與熱情', '提醒你主動推進，把想法化為行動。', '拖延、躁進或疲乏，可能正在削弱你的火力。'],
  聖杯: ['情感與關係', '情緒、連結與內心需求是關鍵。', '情緒積壓或混亂，正在遮住問題核心。'],
  寶劍: ['思考與決斷', '把事實說清楚，判斷才會穩。', '過度思考，可能比現實本身更吵雜。'],
  錢幣: ['現實與穩定', '把注意力放回資源、身體與長期穩定。', '對安全感的壓力，正在打亂你的專注。'],
};
const minorArcana = Object.entries(suitDetails).flatMap(([suit, [keywords, upright, reversed]]) => minorRanks.map((rank) => ({ nameZh: `${suit}${rank}`, nameEn: `${rank} of ${suit}`, keywords, upright, reversed, arcana: '小阿爾克那' })));
const deck = [...majorArcana, ...minorArcana];

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function shuffle(cards) { return [...cards].sort(() => Math.random() - 0.5); }
function positionMeaning(spreadId, position) {
  const meanings = {
    single: { 核心訊息: '這是本次占卜最核心的訊息。' },
    relationship: { 我的狀態: '看見你此刻帶進這段關係的感受與期待。', 對方的狀態: '提供理解對方目前能量的另一個角度。', 關係建議: '提醒這段關係最值得被好好照顧的方向。' },
    career: { 目前優勢: '指出你已經具備、可以善用的能力與資源。', 關鍵阻礙: '提醒目前最需要正視或調整的環節。', 行動方向: '提供一個可以開始實踐的方向。' },
    inner: { 表層感受: '看見此刻最容易被感受到的情緒。', 深層需求: '辨認情緒底下真正渴望被回應的需要。', 溫柔提醒: '給自己一個不必逼迫、仍能向前的提醒。' },
    cross: { 此刻核心: '聚焦這件事此刻最重要的本質。', 正在支持你: '看見正在默默幫助你的條件與力量。', 需要放下: '提醒可以暫時鬆開的執著或壓力。', 下一步: '指出眼前最適合採取的行動。', 整體訊息: '把所有線索收束成這次閱讀的核心方向。' },
    timeline: { 過去脈絡: '顯示事情如何發展到現在。', 當下狀態: '指出此刻最重要的狀態。', 近期未來: '顯示若照目前節奏走下去，接下來可能的發展。' },
    choice: { '選項 A': '呈現第一個方向的氣氛、代價與成長性。', '選項 B': '呈現第二個方向的氣氛、代價與成長性。', 整體建議: '這不是替你做決定，而是提醒你該怎麼選。' },
  };
  return meanings[spreadId][position];
}
function localReading(cards) {
  const lead = cards[0];
  const reversed = cards.find((card) => card.reversed);
  return {
    summary: `${lead.nameZh} 指出你現在最需要正視的主題是「${lead.keywords}」。${cards.filter((card) => card.arcana === '大阿爾克那').length ? '這件事帶著明顯的轉折意義。' : '這組牌更接近日常節奏與眼前選擇。'}`,
    action: `先從「${lead.position}」開始最有效。${lead.nameZh} 的方向是：${lead.upright} 把這個提醒化成一個可完成的小動作。`,
    caution: reversed ? `${reversed.nameZh} 的逆位提醒你：${reversed.reversed}` : '整體走向有空間，但不要因為方向看起來順，就太早停止確認自己的感受與界線。',
  };
}

function MagicPanel({ className = '', children }) {
  function followPointer(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
  }
  return <section className={`magic-panel ${className}`} onPointerMove={followPointer}>{children}</section>;
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

function TarotCard({ card, revealed, index }) {
  return <article className={`tarot-card ${revealed ? 'is-revealed' : ''}`} style={{ '--delay': `${index * 120}ms` }}>
    <div className="tarot-card__inner">
      <div className="tarot-card__back"><span className="card-star">✦</span><span>{card.position}</span><small>ARCANA</small></div>
      <div className="tarot-card__front">
        <span className="card-position">{card.position}</span>
        <div><span className="card-moon">☾</span><h3>{card.nameZh}</h3><p>{card.nameEn}</p></div>
        <div><span className={card.reversed ? 'card-orientation reversed' : 'card-orientation'}>{card.reversed ? '逆位' : '正位'}</span><p className="card-copy">{card.reversed ? card.reversed : card.upright}</p></div>
      </div>
    </div>
  </article>;
}

export default function App() {
  const [spreadId, setSpreadId] = useState('single');
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('感情');
  const [cards, setCards] = useState([]);
  const [reading, setReading] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const spread = spreads.find((item) => item.id === spreadId) ?? spreads[0];

  async function draw() {
    if (!question.trim()) { setError('先寫下你想問的事，牌面才知道從哪裡開始。'); return; }
    setError(''); setReading(null); setLoading(true); setRevealed(false);
    const selected = shuffle(deck).slice(0, spread.count).map((card, index) => ({ ...card, position: spread.positions[index], positionMeaning: positionMeaning(spread.id, spread.positions[index]), reversed: Math.random() < 0.35 }));
    setCards(selected);
    await sleep(520);
    setRevealed(true);
    let nextReading = localReading(selected);
    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          spread,
          cards: selected.map((card) => ({
            nameZh: card.nameZh,
            nameEn: card.nameEn,
            position: card.position,
            reversed: card.reversed,
            keywords: card.keywords,
            meaning: card.reversed ? card.reversed : card.upright,
          })),
        }),
      });
      const payload = await response.json();
      if (response.ok && payload?.summary && payload?.action && payload?.caution) nextReading = payload;
    } catch { /* 本地解讀是刻意的安全備援。 */ }
    await sleep(240);
    setReading(nextReading); setLoading(false);
  }
  function reset() { setQuestion(''); setCards([]); setReading(null); setError(''); setRevealed(false); }

  return <main className="site-shell">
    <div className="star-field" aria-hidden="true" />
    <nav className="topbar"><a href="#top" className="brand"><span>☾</span> 神秘塔羅</a><span>YOUR QUIET READING</span></nav>
    <header className="hero" id="top"><p>給自己的占卜時間</p><ParticleTitle /><div className="hero-orbit" aria-hidden="true" /></header>
    <div className="app-grid">
      <MagicPanel className="question-panel">
        <p className="panel-kicker">01 · SET YOUR INTENTION</p><h2>先說說你在意的事</h2><p className="panel-intro">選擇觀看方式，然後寫下此刻真正想問的問題。不需要完美，只要誠實。</p>
        <label>牌陣<select value={spreadId} disabled={loading} onChange={(event) => setSpreadId(event.target.value)}>{spreads.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>你的問題<textarea value={question} disabled={loading} onChange={(event) => setQuestion(event.target.value)} placeholder="例如：我接下來三個月最該專注的是什麼？" /></label>
        <div className="category-row">{Object.keys(questionGroups).map((item) => <button type="button" className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        <div className="prompt-list">{questionGroups[category].map((item) => <button type="button" onClick={() => setQuestion(item)} key={item}>{item}<span>↗</span></button>)}</div>
        <div className="spread-info"><span><small>抽牌張數</small><b>{spread.count} 張</b></span><span><small>牌陣焦點</small><b>{spread.positions.join(' · ')}</b></span></div>
        <div className="actions"><button className="draw-button" disabled={loading} onClick={draw}>{loading ? '正在翻閱牌面…' : '抽牌解讀'} <span>✦</span></button><button className="reset-button" disabled={loading} onClick={reset}>重設</button></div>
        {error && <p className="error">{error}</p>}
      </MagicPanel>
      <MagicPanel className="reading-panel">
        <div className="reading-head"><div><p className="panel-kicker">02 · THE READING</p><h2>{cards.length ? '牌面正在回應你' : '牌面會在這裡展開'}</h2></div><span className={loading ? 'status busy' : 'status'}><i />{loading ? '整理解讀中' : '靜候你的問題'}</span></div>
        {cards.length ? <div className="card-grid">{cards.map((card, index) => <TarotCard key={`${card.nameZh}-${index}`} card={card} index={index} revealed={revealed} />)}</div> : <div className="empty-card"><span>☾</span><b>尚未抽牌</b><p>在左側留下問題，牌面就會從這裡開始回答。</p><small>MYSTIC TAROT</small></div>}
        {reading && <div className="reading-result">
          <article><small>整體解讀</small><p>{reading.summary}</p></article><article><small>下一步建議</small><p>{reading.action}</p></article><article><small>需要留意</small><p>{reading.caution}</p></article>
        </div>}
        <p className="disclaimer">這份解讀提供反思與方向，不代替專業醫療、法律或財務建議。</p>
      </MagicPanel>
    </div>
  </main>;
}
