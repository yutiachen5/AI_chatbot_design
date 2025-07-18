// server/routes/chat.js
const express = require('express');
const router = express.Router();
const { callDeepseek } = require('../deepseekClient');
const { getFilteredResponse } = require('./filters/topicFilter');

router.post('/', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Step 1: Check keyword-based quick response FIRST
  const keywordReply = getFilteredResponse(userMessage);
  if (keywordReply) {
    return res.json({ reply: keywordReply });
  }

  // Step 2: Extract part and model numbers
  const partMatch = userMessage.match(/\bPS\d{6,8}\b/i);
  const modelMatch = userMessage.match(/\b[A-Z]{3,}[0-9]{2,}[A-Z0-9]*\b/i);
  const partNum = partMatch?.[0]?.toUpperCase();
  const modelNum = modelMatch?.[0]?.toUpperCase();

  // Step 3: Let LLM decide if the question is in scope
  const scopePrompt = [
    {
      role: "system",
      content: "You are a scope classifier. Answer ONLY with 'yes' or 'no'. Is the following question about appliance parts (e.g. price, installation, compatibility) or model-related support (e.g. diagrams, symptoms, installation)? And is the question about dishwashers or refrigerators?",
    },
    { role: "user", content: userMessage },
  ];

  try {
    const scopeReply = await callDeepseek(scopePrompt);
    const isInScope = scopeReply.trim().toLowerCase().startsWith('yes');

    if (!isInScope) {
      return res.json({ reply: "I'm here to help with questions in a limited scope. For other topics, please contact customer support." });
    }

    // Step 4: If part/model present, proceed with LLM reasoning
    if (partNum || modelNum) {
      const prompt = [
        {
          role: "system",
          content: `
You are a customer assistant who answers questions about appliance parts and models.

If the user asks about a part (e.g., PS11752778), determine if they are asking for:
- price
- installation (tools, difficulty, time)
- troubleshooting
- customer reviews
- customer repair stories
- Q&A
- model cross-reference
- compatibility with a specific model

For each relevant type of information they request, reply with something like:
"You can find installation instructions by searching the part number ${partNum} on our website."

If they ask something that cannot be found on the website, say:
"We currently do not have that information available."

For model numbers (e.g., WDT780SAEM1), if they ask for:
- installation instructions
- common symptoms
- Q&A
- parts and section diagrams

Then say:
"You can find installation instructions by searching the model number ${modelNum} on our website."

If the request is unrelated to these topics, reply:
"We currently do not have that information available."
`,
        },
        { role: "user", content: userMessage },
      ];

      const llmReply = await callDeepseek(prompt);
      return res.json({ reply: llmReply });
    }

    // Step 5: If no part/model info, still try LLM to respond on scope question
    const fallbackPrompt = [
      {
        role: "system",
        content: "You are a helpful assistant answering questions about dishwashers and refrigerators, including repair help, parts, pricing, and compatibility.",
      },
      { role: "user", content: userMessage },
    ];
    const fallbackReply = await callDeepseek(fallbackPrompt);
    return res.json({ reply: fallbackReply });

  } catch (error) {
    console.error("LLM error:", error);
    return res.status(500).json({ error: 'LLM failure' });
  }
});

module.exports = router;
