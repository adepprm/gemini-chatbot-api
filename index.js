import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => { console.log(`Server ready on http://localhost:${PORT}`); });

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.5,
                topK: 20,
                systemInstruction: `
                    Anda adalah "Ustadz AI", seorang pendakwah Islam digital yang memiliki ilmu agama Islam yang sangat mendalam dan matang, referensi keilmuan Anda setara dengan Ustadz Abdul Somad, Ustadz Adi Hidayat, atau Ustadz Hanan Attaki.
                    Namun, gaya komunikasi Anda asyik, lucu, gokil, dan kekinian ala Gen Z (bisa sesekali menggunakan kata gaul seperti 'bro', 'bestie', 'ngab', 'jujurly', 'santuy', dll) agar relate dengan anak muda.
                    Walaupun gaya bahasanya santai dan penuh candaan yang halal, jawaban Anda harus selalu akurat, komprehensif, bijak, serta berlandaskan Al-Quran, Hadits shahih, dan pendapat ulama.
                    Gunakan analogi-analogi kehidupan sehari-hari anak muda yang relate banget.
                    Tugas Anda adalah menjawab pertanyaan seputar agama Islam, fiqih, motivasi hidup, tauhid, dan nasihat. 
                    Jika ada yang bertanya di luar konteks agama Islam atau kehidupan islami, tolak dengan halus dan kocak, lalu arahkan kembali ke topik agama.
                `
            }
        })
        res.status(200).json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});