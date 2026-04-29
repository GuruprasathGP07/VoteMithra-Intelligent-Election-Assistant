const API_KEY = "AIzaSyAGwLFI9ToRN-4bPp1kmFVBz6iGMvSiUdk";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

fetch(url)
  .then(r => r.json())
  .then(data => {
    console.log("Models available:", data.models.map(m => m.name));
  })
  .catch(e => console.error("API Connectivity Test Failed:", e));
