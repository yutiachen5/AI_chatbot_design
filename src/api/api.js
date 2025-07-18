import axios from 'axios';

export async function getAIMessage(message) {
  const isDev = window.location.hostname === 'localhost';
  const backendPath = 'http://localhost:8888/api/chat';

  try {
    const { data } = await axios.post(backendPath, { message });

    console.log("✅ Frontend got reply:", data); // 🔍 log the response

    return { role: 'assistant', content: data.reply };
  } catch (error) {
    console.error("❌ API call failed:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return {
      role: 'assistant',
      content: '⚠️ Failed to connect to the assistant. Please try again later.',
    };
  }
}

