import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// ✅ Lazy load all pages — each route loads only when visited
const Home = lazy(() => import('./pages/Home'));
const ElectionSimulator = lazy(() => import('./pages/ElectionSimulator'));
const EVMSimulator = lazy(() => import('./pages/EVMSimulator'));
const FakeNews = lazy(() => import('./pages/FakeNews'));
const Protection = lazy(() => import('./pages/Protection'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Locator = lazy(() => import('./pages/Locator'));
const Nomination = lazy(() => import('./pages/Nomination'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Eligibility = lazy(() => import('./pages/Eligibility'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Guidance = lazy(() => import('./pages/Guidance'));
const Candidates = lazy(() => import('./pages/Candidates'));

/**
 * Full-screen loading spinner shown while a lazy chunk is being fetched.
 * @returns {JSX.Element}
 */
const PageLoader = () => (
  <div
    role="status"
    aria-label="Loading page content"
    className="flex items-center justify-center min-h-[60vh]"
  >
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm text-gray-500 font-medium">Loading…</p>
    </div>
  </div>
);

/**
 * Root application component.
 * Uses React.lazy + Suspense for route-level code splitting,
 * reducing the initial JS bundle size and improving Time-to-Interactive.
 *
 * @returns {JSX.Element} The full application shell with routing.
 */
function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip-to-content link for keyboard and screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-blue-700 focus:font-semibold"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-grow pt-16 pb-9">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulator" element={<ElectionSimulator />} />
            <Route path="/evm" element={<EVMSimulator />} />
            <Route path="/fakenews" element={<FakeNews />} />
            <Route path="/protection" element={<Protection />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/locator" element={<Locator />} />
            <Route path="/nomination" element={<Nomination />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/guide" element={<Guidance />} />
            <Route path="/candidates" element={<Candidates />} />
          </Routes>
        </Suspense>
      </main>

      <Chatbot />
      <Footer />

      <div
        className="fixed bottom-0 left-0 right-0 h-9 bg-red-main text-white flex items-center justify-center text-[10px] sm:text-xs font-medium z-[999] px-2 text-center"
        role="alert"
        aria-live="polite"
      >
        {t('footer.emergency')}
      </div>
    </div>
  );
}

export default App;
