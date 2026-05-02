import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import FeatureErrorBoundary from './components/FeatureErrorBoundary';
import AppRoutes from './components/AppRoutes';

/**
 * Root application component.
 * Uses AppRoutes for route-level code splitting and error boundaries.
 * @returns {JSX.Element} The full application shell with routing.
 */
function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow pt-16 pb-9">
        <AppRoutes />
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
