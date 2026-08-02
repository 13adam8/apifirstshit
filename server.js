import express from "express";
import Groq from "groq-sdk";
import { createClient } from '@supabase/supabase-js';
import crypto from "crypto";

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/generate-text', async (req, res) => {
  const userKey = req.headers.authorization?.replace('Bearer ', '');
  if(!userKey) return res.status(401).json({error: "عطيني المفتاح"});

  const { data: user } = await supabase.from('users').select('*').eq('api_key', userKey).single();
  if(!user) return res.status(401).json({error: "مفتاح غالط"});
  if(user.credits <= 0) return res.status(402).json({error: "شحن الرصيد"});

  await supabase.from('users').update({ credits: user.credits - 1 }).eq('id', user.id);
  await supabase.from('usage_logs').insert({ user_id: user.id, api_name: 'generate-text' });

  const result = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: req.body.prompt }]
  });

  res.json({ text: result.choices[0].message.content, credits_left: user.credits - 1 });
});

app.listen(10000, () => console.log("السيرفر خدام على 10000"));
