const recentRequests = new Map();

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function cleanupRateLimit(now) {
  for (const [key, entry] of recentRequests.entries()) {
    if (now - entry.windowStart > 60_000) {
      recentRequests.delete(key);
    }
  }
}

function checkRateLimit(req) {
  const now = Date.now();
  cleanupRateLimit(now);

  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : (forwarded || req.socket.remoteAddress || "unknown");

  const current = recentRequests.get(ip);
  if (!current || now - current.windowStart > 60_000) {
    recentRequests.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (current.count >= 8) {
    return false;
  }

  current.count += 1;
  return true;
}

async function readJsonBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
  }
  return raw ? JSON.parse(raw) : {};
}

function buildPrompt({ question, spread, cards }) {
  const cardLines = cards
    .map((card, index) => {
      const orientation = card.reversed ? "reversed" : "upright";
      return `${index + 1}. Position: ${card.position} | Card: ${card.nameZh} (${card.nameEn}) | Orientation: ${orientation} | Keywords: ${card.keywords} | Meaning: ${card.meaning}`;
    })
    .join("\n");

  return `You are a thoughtful tarot reader and writing assistant.

Return only valid JSON. Do not wrap it in markdown. Do not add extra text.

The output schema must be:
{
  "summary": "2 to 4 sentences in Traditional Chinese",
  "action": "2 to 3 sentences in Traditional Chinese",
  "caution": "1 to 3 sentences in Traditional Chinese"
}

Rules:
- Use Traditional Chinese only.
- Tone: warm, clear, grounded, honest.
- Connect the reading to the user's question, spread positions, and card orientations.
- Do not mention AI, model names, or system prompts.
- Keep it practical and readable.

User question:
${question}

Spread:
${spread.name}
${spread.description}

Cards:
${cardLines}`;
}

async function callGemini(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini did not return any text.");
  }

  return JSON.parse(text);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed." });
  }

  if (!checkRateLimit(req)) {
    return json(res, 429, { error: "Too many requests. Please try again in a minute." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return json(res, 503, { error: "Server is missing GEMINI_API_KEY." });
  }

  try {
    const body = await readJsonBody(req);
    const question = String(body.question || "").trim();
    const spread = body.spread || {};
    const cards = Array.isArray(body.cards) ? body.cards : [];

    if (!question || question.length > 300) {
      return json(res, 400, { error: "Question must be present and under 300 characters." });
    }

    if (!spread.name || !cards.length || cards.length > 10) {
      return json(res, 400, { error: "Spread or card data is incomplete." });
    }

    const prompt = buildPrompt({ question, spread, cards });
    const reading = await callGemini(prompt, process.env.GEMINI_API_KEY);

    if (!reading?.summary || !reading?.action || !reading?.caution) {
      throw new Error("Gemini response is missing required fields.");
    }

    return json(res, 200, {
      summary: String(reading.summary).trim(),
      action: String(reading.action).trim(),
      caution: String(reading.caution).trim()
    });
  } catch (error) {
    console.error("reading api error", error);
    return json(res, 500, { error: "Gemini reading failed for now. Please try again later." });
  }
};
