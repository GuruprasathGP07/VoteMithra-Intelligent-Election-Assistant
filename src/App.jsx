import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ElectionSimulator from './pages/ElectionSimulator';
import EVMSimulator from './pages/EVMSimulator';
import FakeNews from './pages/FakeNews';
import Protection from './pages/Protection';
import Quiz from './pages/Quiz';
import Locator from './pages/Locator';
import Nomination from './pages/Nomination';
import Timeline from './pages/Timeline';
import Eligibility from './pages/Eligibility';
import Guidance from './pages/Guidance';
import Candidates from './pages/Candidates';
import FAQ from './pages/FAQ';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16 pb-9">
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
        </main>
        <Chatbot />
        <Footer />
        <div className="fixed bottom-0 left-0 right-0 h-9 bg-red-main text-white flex items-center justify-center text-[10px] sm:text-xs font-medium z-[999] px-2 text-center">
           {t('footer.emergency')}
        </div>
      </div>
  );
}

export default App;
