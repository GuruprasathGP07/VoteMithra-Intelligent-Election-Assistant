# VoteMithra - Intelligent Election Assistant

Help Indian citizens (especially first-time voters) participate in elections through education, simulation, and AI.

## Features
- **AI Voter Assistant**: Gemini-powered multilingual chatbot for election queries.
- **EVM Simulator**: Interactive electronic voting machine simulation.
- **Fake News Detection**: AI-based misinformation scanner for election messages.
- **Voter Knowledge Quiz**: Test your knowledge and earn a certificate.
- **Eligibility Checker**: Quick guide to voting qualifications in India.
- **Polling Booth Locator**: Find your nearest station using Google Maps.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM.
- **Localization**: i18next (supports 6+ Indian languages).
- **Backend/Services**: Firebase (Auth, Realtime DB, Analytics).
- **AI**: Google Gemini API.
- **Infrastructure**: Docker, Nginx, Google Cloud Run, Cloud Build.

## Google Services Integration
- **Gemini AI**: Powers the intelligent chatbot and fake news analysis with an automated model-fallback chain.
- **Firebase**: Handles anonymous authentication, real-time feedback storage, and engagement analytics.
- **Google Maps API**: Integrated polling station locator with custom markers and accessibility focus.
- **BigQuery (Cloud Functions)**: Deep-telemetry logging via Firebase Cloud Functions for advanced election data analysis.
- **Google Cloud**: Hosted on Cloud Run with automated CI/CD via Cloud Build.

## Security & Reliability
- **Environment Isolation**: All API keys managed via secure environment variables.
- **Input Sanitization**: Multi-layer sanitization (DOMPurify + Custom Regex) on all user-facing inputs.
- **API Resilience**: Automated fallback between Gemini models ensuring service availability during high demand.

## Testing
The project maintains a robust, stable test suite using **Vitest** and **React Testing Library**.
- **Coverage**: **~94% Statements**, **~84% Branches**, **~96% Lines**.
- **Stability**: **53+ tests passing** with 100% deterministic results.
- **Integration**: Full voter-journey verification, including VVPAT timers and i18n switching.

To run tests:
```bash
npm run test:coverage
```

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env` and add your API keys.
4. Start development server: `npm run dev`.