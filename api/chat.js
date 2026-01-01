// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    // Debug: angalia kama message ipo
    console.log("Message received:", message);

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    // Debug: angalia kama API key ipo
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing!");
      return res.status(500).json({ reply: "Server misconfiguration ⚠️" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Bmb Tech Ai, a smart and friendly AI assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Debug: angalia response kutoka OpenAI
    console.log("OpenAI response:", JSON.stringify(data));

    if (data.error) {
      return res.status(500).json({ reply: `OpenAI error: ${data.error.message}` });
    }

    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error ⚠️" });
  }
        }
