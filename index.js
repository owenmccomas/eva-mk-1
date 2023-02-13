const { Configuration, OpenAIApi } = require("openai");
const say = require("say");

require('dotenv').config()

const leopardKey = process.env.PICOVOICE_API_KEY;
const {Leopard} = require("@picovoice/leopard-node");
const handle = new Leopard(leopardKey);


const transcribe = () => {
    const result = handle.processFile('./audio/Recording1.m4a');
    console.log(`me: ${result.transcript}`);
    return result
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function runCompletion () {
    const result = transcribe();
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: result.transcript,
        temperature: 0.7,
        max_tokens: 156,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const text = response.data.choices[0].text
    console.log(`Eva: ${text}`);
    say.speak(text, 'Microsoft Zira Desktop');
}

// function getVoices() {
//     return new Promise((resolve) => {
//       say.getInstalledVoices((err, voice) => {
//         return resolve(voice)
//       })
//     })
//   }
//   async function usingVoices() {
//     const voicesList = await getVoices();
//     console.log(voicesList)
//   }
//   usingVoices()


runCompletion();

