import express from "express";
import { Groq } from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post("/lead", async (req, res) => {
  const { name, phone, interest } = req.body;
  const { error } = await supabase.from("leads").insert([{ name, phone, interest }]);
  if(error) return res.status(500).json({error});
  res.json({ok: true});
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
