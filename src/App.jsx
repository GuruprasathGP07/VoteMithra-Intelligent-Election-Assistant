import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';
import FeatureErrorBoundary from './components/FeatureErrorBoundary';
import { ROUTES } from './utils/constants';

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
      <Header />

      <div className="flex-grow pt-16 pb-9">
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.SIMULATOR}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <ElectionSimulator />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.EVM}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <EVMSimulator />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.FAKENEWS}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FakeNews />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.LAWS}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Protection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.QUIZ}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Quiz />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.LOCATOR}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Locator />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.NOMINATION}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Nomination />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.TIMELINE}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Timeline />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.ELIGIBILITY}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Eligibility />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.FAQ}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FAQ />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.GUIDE}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Guidance />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.CANDIDATES}
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Candidates />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Routes>
      </div>

      <FeatureErrorBoundary featureName="AI Voter Coach">
        <Chatbot />
      </FeatureErrorBoundary>
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

