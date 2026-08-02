import express from "express";
import { Groq } from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post("/chat", async (req, res) => {
  try {
    console.log("Message received:", req.body.message);
    console.log("Key exists:",!!process.env.GROQ_KEY);

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: req.body.message }],
      model: "llama-3.1-8b-instant",
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const chat = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: message }]
  });
  res.json({ reply: chat.choices[0].message.content });
});

app.listen(process.env.PORT || 3000, () => console.log("السيرفر خدام"));
