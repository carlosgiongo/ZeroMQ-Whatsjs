require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"});

module.exports = async function(binaryData, mimeType) {
    const audio = {
        inlineData: {
            data: binaryData,
            mimeType: mimeType,
        }
    }

    const prompt = 'Transcribe the audio to text. The audio can be in any language.';
    const response = await model.generateContent([audio, prompt]);
    
    let text = "* Sorry, I couldn't transcribe the audio to text. Reply to the user who could not understand *";
    if (response.response.candidates) { 
        text = ""
        response.response.candidates[0].content.parts.forEach((content) => {
            text += content.text + " ";
        })
    }

    return text;
}