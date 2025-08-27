export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, countryCode, phone, currency, amount, details } = req.body;
    
    // Your Telegram bot token (set as environment variable in Vercel)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    const message = `
🔐 *New Crypto Recovery Case Submitted* 🔐

*Name:* ${name}
*Email:* ${email}
*Phone:* +${countryCode} ${phone}
*Cryptocurrency:* ${currency}
*Amount Lost:* ${amount}

*Case Details:*
${details}

*Submitted on:* ${new Date().toLocaleString()}
    `;

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Failed to send message to Telegram' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
