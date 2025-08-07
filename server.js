const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System instruction to guide Gemini
const SYSTEM_INSTRUCTION = `
You are an AI Tools Recommender Bot. 
For every prompt, return a numbered list (1 to 5) of AI tools relevant to the user's topic. 
For each tool, include:
- Tool name
- A one-line description of its purpose
- A direct link to the tool

Only return tool recommendations. No long explanations or markdown. Keep it clean and concise.
`;

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Add user query to system prompt
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "API request failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
