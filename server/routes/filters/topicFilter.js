
// keyword-based responses
const keywordResponses = [
  {
    keywords: ["customer", "service", "support"],
    response: "For our customer service, please call 1-866-319-8402 (Monday to Saturday, 8am - 9pm EST).",
  },
  {
    keywords: ["price", "cost", "how much"],
    response: "Prices vary by model and part. Please visit our popular parts and models for more details.",
  },
  {
    keywords: ["refund", "return", "money back"],
    response: "We offer a 365-day return period and we have a one year warranty on parts that failed after being installed to compatible units. Please visit https://www.partselect.com/365-Day-Returns.htm for more details.",
  },
  {
    keywords: ['promotion', 'discount', 'coupon', 'lower price', 'cheaper', 'promo code', 'promotional code'],
    response: "We offer a 10% off code if you sign up for subscription. Go to https://www.partselect.com/user/create/ for creating a new account.",
  },
  {
    keywords: ['shipping', 'delivery', 'deliver', 'how many days'],
    response: "The order before 4pm ET Monday through Friday will be shipped on the same day. Order after 4pm will either be shipped on the same day or on the next business day. For more information , please visit: https://www.partselect.com/Same-Day-Shipping.htm.",
  },
  {
    keywords: ['warranty', 'discount', 'coupon', 'lower price', 'cheaper', 'promo code', 'promotional code'],
    response: "Most of our products include a 1-year warranty. Please visit https://www.partselect.com/One-Year-Warranty.htm for more details.",
  },
  {
    keywords: ['repair', 'maintenance', 'fix'],
    response: "We have a guidance on help with your DIY repair: https://www.partselect.com/Repair.",
  },

];

function getFilteredResponse(message) {
  const lower = message.toLowerCase();

  // 1. Check keyword-based responses
  for (const entry of keywordResponses) {
    if (entry.keywords.some(keyword => lower.includes(keyword))) {
      return entry.response;
    }
  }

  // 2. Match part numbers like PS11752778
  const partMatch = message.match(/\bPS\d{6,8}\b/i);

  // 3. Match model numbers like WDT780SAEM1 (rough heuristic)
  const modelMatch = message.match(/\b[A-Z]{3,}[0-9]{2,}[A-Z0-9]*\b/i);

  if (partMatch || modelMatch) {
    const parts = [];

    if (partMatch) {
      const partNum = partMatch[0].toUpperCase();
      parts.push(`Please do a search on our website to find more information about this part number.`);
    }

    if (modelMatch) {
      const modelNum = modelMatch[0].toUpperCase();
      parts.push(`Please do a search on our website to find more information about this model.`);
    }

    return `Here’s what I found:\n${parts.join('\n')}`;
  }

  return null;
}


module.exports = { getFilteredResponse };
