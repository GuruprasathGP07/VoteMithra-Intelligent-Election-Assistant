const API_KEY = "AIzaSyDoxpwMOnwJF8Jy6_37AKzRpFFoveItyhE";
const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-latest"];

async function test() {
  for (const model of models) {
    console.log(`Testing model: ${model}...`);
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;
    try {
        const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        });
        const data = await r.json();
        if (data.candidates) {
            console.log(`SUCCESS with model: ${model}`);
            process.exit(0);
        } else {
            console.log(`FAILED with model: ${model}. Error: ${JSON.stringify(data.error)}`);
        }
    } catch (e) {
        console.log(`ERROR with model: ${model}: ${e.message}`);
    }
  }
}

test();
