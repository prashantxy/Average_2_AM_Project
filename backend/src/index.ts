import express from "express";
import type { Request, Response } from "express";
import multer from "multer";
import pdfParse from "pdf-parse"; // Default import with official types
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Debug the pdfParse export
console.log("pdfParse:", pdfParse);

const pdfParseFn =  pdfParse; 

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

app.post('/generate', upload.single("pdf"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a PDF file" });
    }

    const data = await pdfParseFn(req.file.buffer);
    const text = data.text.trim().slice(0, 100000);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an educational AI assistant.
      Based on the given text, generate 5 multiple choice questions and 5 short answer questions.
      Each MCQ should have 4 options and indicate the correct answer clearly.

      Text:
      ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = response.text();

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});