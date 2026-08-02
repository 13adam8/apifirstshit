import express from "express";
import Groq from "groq-sdk";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

console.log("GROQ_KEY loaded:",!!process.env.GROQ_KEY); // باش نتأكدو

const groq = new Groq({
  apiKey: process.env.GROQ_KEY
});

app.get("/", (req, res) => res.send("API is running"));

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Request:", message);

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("ERROR:", error); // هادي غادي تبان فـ Logs
    res.status(500).json({ error: error.message, type: error.name });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("السيرفر خدام");
});
