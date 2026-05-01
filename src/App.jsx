import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';

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
    className="min-h-screen flex items-center justify-center"
    aria-label="Loading page"
    role="status"
  >
    <div className="text-center">
      <div
        className="w-10 h-10 border-4 border-blue-800 border-t-transparent
                      rounded-full animate-spin mx-auto mb-3"
      />
      <p className="text-gray-500 text-sm">Loading...</p>
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
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/simulator"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <ElectionSimulator />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/evm"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <EVMSimulator />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/fakenews"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FakeNews />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/protection"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Protection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/quiz"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Quiz />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/locator"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Locator />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/nomination"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Nomination />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/timeline"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Timeline />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/eligibility"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Eligibility />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/faq"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FAQ />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/guide"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Guidance />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/candidates"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Candidates />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Routes>
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
