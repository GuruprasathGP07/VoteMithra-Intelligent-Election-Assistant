/**
 * @fileoverview Centralized route definitions for VoteMithra.
 * Extracted from App.jsx to eliminate duplication and improve modularity.
 * @module components/AppRoutes
 */

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import FeatureErrorBoundary from './FeatureErrorBoundary';
import { ROUTES } from '../utils/constants';

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

// Lazy load all pages — each route loads only when visited
const Home = lazy(() => import('../pages/Home'));
const ElectionSimulator = lazy(() => import('../pages/ElectionSimulator'));
const EVMSimulator = lazy(() => import('../pages/EVMSimulator'));
const FakeNews = lazy(() => import('../pages/FakeNews'));
const Protection = lazy(() => import('../pages/Protection'));
const Quiz = lazy(() => import('../pages/Quiz'));
const Locator = lazy(() => import('../pages/Locator'));
const Nomination = lazy(() => import('../pages/Nomination'));
const Timeline = lazy(() => import('../pages/Timeline'));
const Eligibility = lazy(() => import('../pages/Eligibility'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Guidance = lazy(() => import('../pages/Guidance'));
const Candidates = lazy(() => import('../pages/Candidates'));

/**
 * AppRoutes — defines all application routes with error boundaries.
 * Eliminates route duplication that previously existed in App.jsx.
 * @returns {JSX.Element} Application route tree.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={<ErrorBoundary><Home /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.SIMULATOR}
          element={<ErrorBoundary><ElectionSimulator /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.EVM}
          element={<FeatureErrorBoundary featureName="EVM Simulator"><EVMSimulator /></FeatureErrorBoundary>}
        />
        <Route
          path={ROUTES.FAKENEWS}
          element={<FeatureErrorBoundary featureName="Fake News Detector"><FakeNews /></FeatureErrorBoundary>}
        />
        <Route
          path={ROUTES.LAWS}
          element={<ErrorBoundary><Protection /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.QUIZ}
          element={<FeatureErrorBoundary featureName="Quiz"><Quiz /></FeatureErrorBoundary>}
        />
        <Route
          path={ROUTES.LOCATOR}
          element={<FeatureErrorBoundary featureName="Polling Locator"><Locator /></FeatureErrorBoundary>}
        />
        <Route
          path={ROUTES.NOMINATION}
          element={<ErrorBoundary><Nomination /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.TIMELINE}
          element={<ErrorBoundary><Timeline /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.ELIGIBILITY}
          element={<ErrorBoundary><Eligibility /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.FAQ}
          element={<ErrorBoundary><FAQ /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.GUIDE}
          element={<ErrorBoundary><Guidance /></ErrorBoundary>}
        />
        <Route
          path={ROUTES.CANDIDATES}
          element={<ErrorBoundary><Candidates /></ErrorBoundary>}
        />
      </Routes>
    </Suspense>
  );
}
