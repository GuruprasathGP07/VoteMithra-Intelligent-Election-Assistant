# Problem Statement Alignment

## Hackathon Challenge
"Create an assistant that helps users understand the election 
process, timelines, and steps in an interactive and 
easy-to-follow way."

## How VoteMithra Addresses Every Requirement

### "Assistant"
Google Gemini-powered AI Voter Coach responds in 6 Indian 
languages. System prompt dynamically injects user's selected 
language (en/hi/ta/te/kn/ml) ensuring native-language responses.
Automated fallback chain: Gemini 1.5 Pro → Flash ensures 
24/7 availability.

### "Election Process"
Seven dedicated modules cover the complete process:
- Voter Registration (Eligibility Checker + guide)
- Nomination Process (step-by-step guide)
- Campaign Period (MCC explainer)
- Polling Day (Election Day Simulator with 10 steps)
- EVM Usage (High-fidelity EVM Simulator + VVPAT)
- Vote Counting (Vote Confidence page)
- Result Declaration (Election Timeline)

### "Timelines"
Dedicated Election Timeline page with 6 phases:
Registration → Nomination → Campaign → Silence Period 
→ Polling Day → Counting & Result.
Each phase includes voter action items and deadlines.
Live countdown to next election date.

### "Interactive"
- 10-step Election Day Simulator with civic judgment challenges
- EVM Simulator with VVPAT verification flow
- Fake News Detector with swipe-to-classify mechanic
- 10-question Quiz with per-question law citations
- Eligibility Checker with instant form-based result
- AI chatbot with contextual conversation history

### "Easy-to-Follow"
- 6 Indian languages via i18next (en, hi, ta, te, kn, ml)
- AI chatbot responds natively in selected language
- Visual journey map replacing flat navigation
- Step-by-step progress bars in all simulators
- Completion certificates with QR codes
- ECI Emergency Helplines with tap-to-call on mobile

## Google Services Used
| Service | Purpose |
|---|---|
| Google Gemini API | AI chatbot + fake news detection + legal checker |
| Google Maps JS API | Polling booth locator with live markers |
| Google Geocoding API | PIN code to coordinates conversion |
| Google Places API | Nearest booth search |
| Firebase Auth (Anonymous) | Session tracking without login |
| Firebase Realtime Database | Leaderboard + misinformation wall |
| Firebase Analytics | Feature usage tracking |
| Firebase Hosting | Global CDN deployment with SSL |
| Cloud Build | CI/CD pipeline |
| Cloud Run | Serverless auto-scaling deployment |
| GCP Secret Manager | Secure API key management |
| Google Fonts | Playfair Display + DM Sans |
