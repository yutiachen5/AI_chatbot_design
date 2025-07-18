const axios = require('axios');

async function callDeepseek(message) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const url = process.env.DEEPSEEK_URL || 'https://api.deepseek.com/v1/chat/completions';

  if (!apiKey) throw new Error("❌ Missing DEEPSEEK_API_KEY");

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const data = {
    model: "deepseek-chat", // or the appropriate model ID
    messages: [{ role: "user", content: message }],
    temperature: 0.7,
  };

//  console.log("📨 Message:", message);
  try {
    const response = await axios.post(url, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Axios error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { callDeepseek };
