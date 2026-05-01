# VoteMithra – Intelligent Election Assistant 🗳️🇮🇳

**VoteMithra** is a production-grade, AI-powered civic-tech platform designed to revolutionize voter education and democratic participation in India. Built on Google's AI and Cloud ecosystem, it empowers first-time voters with real-time guidance, interactive simulations, and multilingual support.

## Problem Statement Alignment

This project was built for the **PromptWars Hackathon — 
Election Process Education** challenge.

**Challenge:** "Create an assistant that helps users understand 
the election process, timelines, and steps in an interactive 
and easy-to-follow way."

VoteMithra is the most complete possible answer to this 
challenge — combining a Gemini AI assistant, 10-step interactive 
simulation, 6-language support, legal rights education, 
ECI emergency helplines, and a full Google Cloud deployment 
into a single civic platform.

➡️ See [ALIGNMENT.md](./ALIGNMENT.md) for detailed mapping.

🌐 **Live Demo:** https://vote-mithra-917825806061.us-central1.run.app  
💻 **GitHub:** https://github.com/GuruprasathGP07/VoteMithra-Intelligent-Election-Assistant  
⚡ **Built with:** Google Antigravity (intent-driven development)

---

## 🎯 Problem Statement

Over **26 crore first-time voters** in India face critical challenges:

- ❓ Lack of awareness about voter registration and eligibility
- 📄 Confusion about required documents and procedures
- 🧭 Difficulty understanding the end-to-end voting process
- ⚠️ Vulnerability to election-related misinformation and fake news
- 😰 Anxiety about using Electronic Voting Machines (EVMs)

VoteMithra solves all of these with an intelligent, AI-assisted platform.

---

## ✨ Core Features

### 🤖 AI Voter Coach (Gemini-Powered Chatbot)
- Real-time conversational guidance on all election-related queries
- Powered by **Google Gemini 2.5 Flash** with automated 3-model fallback chain
- Supports 6 Indian languages: English, Tamil, Hindi, Telugu, Kannada, Malayalam
- Constrained to ECI-compliant, neutral, factual responses only

### 🔍 Fake News & Misinformation Detector
- AI-powered scanner that analyzes election-related messages for misinformation
- Returns a credibility score (0–100), verdict (SAFE/SUSPICIOUS/FAKE), and reasoning
- Dual-layer architecture: Cloud Function proxy → Client-side Gemini fallback

### 🗳️ EVM & VVPAT Simulator
- High-fidelity interactive simulation of the Electronic Voting Machine
- Includes the 7-second VVPAT paper slip verification (Supreme Court mandated)
- Reduces voter anxiety and procedural errors for first-time voters

### 🎓 Voter Knowledge Quiz & Certificate
- 10-question gamified quiz on Indian election procedures and laws
- Generates a personalized, downloadable "Informed Voter" certificate (PNG)
- Score-based badge system: Election Champion / Active Citizen / Informed Voter

### 📍 Smart Polling Booth Locator
- Google Maps JS API integration with PIN code-based search
- Geocoding API converts PIN codes to coordinates for precise booth discovery

### 📅 Electoral Timeline
- Visual roadmap from voter registration to result declaration
- Actionable steps for each phase of the election cycle

### ✅ Voter Eligibility Checker
- Logic-based tool to verify voting rights based on ECI guidelines
- Covers age, citizenship, and registration requirements

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, PostCSS |
| Routing | React Router DOM |
| Localization | i18next, react-i18next (6 languages) |
| AI | Google Gemini 2.5 Flash API |
| Backend | Firebase Realtime DB, Firestore, Auth |
| Analytics | Firebase Analytics + Google BigQuery |
| Maps | Google Maps JS API + Geocoding API |
| Infrastructure | Docker, Nginx, GCP Cloud Run, Cloud Build |
| Testing | Vitest, React Testing Library |
| Security | DOMPurify, CSP Headers, Secret Manager |

---

## ☁️ Google Services Integration

VoteMithra is a deep-integration showcase of the Google ecosystem:

### 🧠 Artificial Intelligence
- **Google Gemini 2.5 Flash** — Powers the AI Voter Coach and Fake News Detector
- **Automated Model Fallback Chain** — `gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-2.0-flash-lite` ensures 99.9% AI availability during high-demand periods
- **Multilingual AI** — System prompt forces language-matching responses across 6 Indian languages

### 🔥 Firebase (Backend & Database)
- **Firebase Realtime Database** — Stores anonymous chatbot sessions for quality analysis
- **Firebase Analytics** — Tracks 10+ custom events across all features:
  - `quiz_started`, `quiz_completed` (with score)
  - `evm_vote_cast` (with language)
  - `chatbot_query_sent` (with language)
  - `fakenews_check_performed`
  - `booth_search_performed` (with district)
  - `eligibility_checked` (with result)
  - `language_switched` (from/to)
  - `timeline_viewed`
- **Firebase Authentication** — Anonymous auth for session tracking without PII

### ☁️ Google Cloud Platform
- **Cloud Run** — Fully managed serverless hosting with auto-scaling
- **Cloud Build** — Automated CI/CD pipeline triggered on every push
- **Cloud Functions** — Secure server-side proxy for Gemini API (keeps keys off client)
- **Secret Manager** — Secure storage and injection of API keys at build time
- **BigQuery** — Event-level telemetry for advanced voter behavior analytics

### 🗺️ Google Maps Platform
- **Maps JavaScript API** — Interactive polling booth map with custom markers
- **Geocoding API** — Converts PIN codes to geographic coordinates

---

## 🔐 Security & Reliability

- **API Key Protection** — All keys managed via GCP Secret Manager, never hardcoded
- **Input Sanitization** — DOMPurify + custom regex on all user inputs (chatbot, fake news scanner)
- **Content Security Policy** — Strict CSP headers in Nginx preventing XSS attacks
- **Security Headers** — X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy
- **Rate Limiting** — Nginx rate limiting (30 req/min per IP) prevents API abuse
- **Model Fallback** — 3-model Gemini fallback chain ensures service continuity

---

## 🧪 Testing & Quality

Built with a rigorous, production-grade test suite:

```
Test Files:  8 passed (8)
Tests:       53 passed (53)
Coverage:    ~94% Statements | ~84% Branches | ~97% Lines
```

**Test coverage includes:**
- Unit tests for all major components (Chatbot, EVM Simulator, Quiz, FakeNews, Eligibility)
- Integration tests for complete voter journeys
- Edge case testing (API failures, empty inputs, language switching)
- Mocked external dependencies (Firebase, Gemini, Google Maps) for deterministic CI/CD

Run tests:
```bash
npm run test
npm run test:coverage
```

---

## ♿ Accessibility

- Semantic HTML5 structure throughout
- ARIA labels on all interactive elements (`aria-label`, `aria-pressed`, `aria-live`)
- `role="radiogroup"` with `aria-labelledby` on quiz answer groups
- `aria-live="polite"` on dynamic content regions (chatbot, results)
- Screen-reader-only labels (`sr-only`) on all form inputs
- Full keyboard navigation support
- Fully responsive design across all device sizes

---

## 📦 Deployment Architecture

```
GitHub Push → Cloud Build → Docker (Multi-stage) → Cloud Run
                              ↓
                         Nginx (CSP + Gzip + Cache)
                              ↓
                    React SPA (Code-split bundles)
```

- Multi-stage Docker build (Node 20 build → Nginx alpine serve)
- Gzip compression for all static assets
- 1-year cache headers for JS/CSS/images
- Code splitting: vendor-react, vendor-firebase, vendor-gemini, vendor-i18n, vendor-maps

---

## 📂 Project Structure

```
VoteMithra-Intelligent-Election-Assistant/
├── src/
│   ├── components/          # Chatbot, Header, LanguageSwitcher, ProgressBar
│   ├── pages/               # Home, EVMSimulator, FakeNews, Quiz, Eligibility, Timeline, Locator
│   ├── services/            # firebaseService.js
│   ├── utils/               # gemini.js, analytics.js, sanitize.js
│   ├── tests/               # 8 test files + setup.js + integration/
│   ├── locales/             # en, hi, ta, te, kn, ml JSON files
│   ├── i18n.js
│   ├── main.jsx
│   └── index.css
├── functions/               # Firebase Cloud Functions (Gemini proxy + BigQuery)
├── .github/workflows/       # CI/CD pipeline
├── Dockerfile               # Multi-stage build
├── nginx.conf               # Production server + security headers
├── cloudbuild.yaml          # GCP Cloud Build pipeline
├── vite.config.js           # Code splitting configuration
└── vitest.config.js         # Test configuration with coverage thresholds
```

---

## 🚀 Local Setup

```bash
# Clone the repository
git clone https://github.com/GuruprasathGP07/VoteMithra-Intelligent-Election-Assistant.git
cd VoteMithra-Intelligent-Election-Assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

---

## 🎯 Impact

VoteMithra directly addresses India's voter education crisis:

- ✔ Reduces voter confusion and procedural errors on election day
- ✔ Protects citizens from election misinformation and fake news
- ✔ Makes voting accessible in 6 Indian languages
- ✔ Builds EVM confidence through interactive simulation
- ✔ Strengthens democratic participation for 26 crore first-time voters

---

## ⚡ Built with Google Antigravity

Developed using **intent-driven development** powered by Google Antigravity:

- Rapid prototyping with AI-assisted architecture decisions
- Faster iteration cycles from idea to production deployment
- Seamless integration across the entire Google Cloud ecosystem

---


---

*If you found this project useful, give it a ⭐ on GitHub!*