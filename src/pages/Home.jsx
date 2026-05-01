import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { featureCards, journeyStops } from '../data/features';
import { homeFaqs } from '../data/faqData';
import voterFingerImg from '../assets/images/vote.jpg';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] bg-blue-main flex flex-col items-center justify-center overflow-hidden px-8 py-12 text-center text-white">
        <div className="mt-8 mb-6 relative w-[300px] h-[380px] md:w-[340px] md:h-[460px] rounded-[100px] overflow-hidden border-4 border-white/20 shadow-[-10px_10px_40px_rgba(0,0,0,0.3)] animate-fadeIn shrink-0">
          <img
            src={voterFingerImg}
            alt="Vote"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-blue-main/80 backdrop-blur pb-6 pt-12 mt-auto text-center [mask-image:linear-gradient(to_bottom,transparent,black_40%)]">
            <p className="text-saffron font-bold text-[15px] tracking-widest uppercase px-2 leading-tight">
              {t('hero.title')}
            </p>
          </div>
        </div>

        <div
          className={`transition-all duration-1000 max-w-4xl z-10 space-y-4 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-saffron rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,158,11,0.5)] animate-pulse">
              <span className="material-icons text-blue-main text-5xl">
                how_to_vote
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight font-playfair">
            {t('hero.subtitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            {t('hero.description')}
          </p>
          <p className="text-sm font-light italic text-white/50">
            One vote can shape the future.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              className="btn-primary"
              onClick={() => navigate('/simulator')}
            >
              {t('hero.button_start')}
            </button>
            <button
              className="px-6 py-3 border-2 border-white rounded-radius-sm font-semibold hover:bg-white/10 transition-colors"
              onClick={() =>
                document
                  .getElementById('journey-section')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {t('hero.button_explore')}
            </button>
          </div>
        </div>

        <div className="absolute bottom-5 text-sm text-white/50 animate-bounce">
          ↓ {t('hero.scroll')}
        </div>
      </section>

      {/* Eligibility & AI Assistant Teaser */}
      <section className="py-12 px-8 bg-bg-main">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eligibility Card */}
          <div className="relative overflow-hidden card bg-white p-8 flex items-center justify-between group hover:shadow-2xl transition-all border-none bg-gradient-to-br from-white to-blue-pale/30">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-main"></div>
            <div className="flex-1 relative z-10">
              <h3 className="text-2xl font-bold text-blue-main mb-2 font-playfair">
                {t('home.eligibility_title')}
              </h3>
              <p className="text-muted text-sm mb-6 leading-relaxed">
                {t('home.eligibility_subtitle')}
              </p>
              <button
                className="btn-primary py-2.5 px-8 shadow-lg shadow-blue-main/20 hover:shadow-blue-main/40 transform hover:-translate-y-0.5 transition-all text-sm"
                onClick={() => navigate('/eligibility')}
              >
                {t('home.eligibility_btn')}
              </button>
            </div>
            <div className="ml-4 w-20 h-20 bg-blue-main/5 rounded-2xl flex items-center justify-center text-blue-main group-hover:bg-blue-main group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
              <span className="material-icons text-4xl">how_to_reg</span>
            </div>
          </div>

          {/* AI Coach Card */}
          <div className="relative overflow-hidden card bg-white p-8 flex items-center justify-between group hover:shadow-2xl transition-all border-none bg-gradient-to-br from-white to-saffron/10">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-saffron"></div>
            <div className="flex-1 relative z-10">
              <h3 className="text-2xl font-bold text-blue-main mb-2 font-playfair">
                {t('home.ai_coach_title')}
              </h3>
              <p className="text-muted text-sm mb-6 leading-relaxed">
                {t('home.ai_coach_subtitle')}
              </p>
              <button
                className="bg-saffron text-blue-main font-black py-2.5 px-8 rounded-radius-sm shadow-lg shadow-saffron/20 hover:shadow-saffron/40 transform hover:-translate-y-0.5 transition-all text-sm"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('open-chatbot'))
                }
              >
                {t('home.ai_coach_btn')}
              </button>
            </div>
            <div className="ml-4 w-20 h-20 bg-saffron/5 rounded-2xl flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-blue-main transition-all duration-500 -rotate-3 group-hover:rotate-0">
              <span className="material-icons text-4xl">smart_toy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Map Section */}
      <section
        id="journey-section"
        className="py-20 px-8 max-w-6xl mx-auto w-full"
      >
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl md:text-4xl text-blue-main font-bold font-playfair">
            {t('journey.title')}
          </h2>
          <p className="text-muted">{t('journey.subtitle')}</p>
        </div>

        <div className="relative min-h-[500px]">
          {/* Desktop S-Curve SVG */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 900 400"
            preserveAspectRatio="none"
          >
            <path
              d="M 50 150 C 250 150, 250 300, 450 300 C 650 300, 650 100, 850 100"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="6"
              strokeDasharray="10,10"
            />
          </svg>

          {/* Map Stops */}
          <div className="grid md:block grid-cols-1 gap-6 md:gap-0">
            {journeyStops.map((stop) => (
              <div
                key={stop.id}
                className="md:absolute flex flex-row md:flex-col items-center gap-4 md:gap-2 cursor-pointer transition-transform hover:scale-110 z-10 w-auto md:w-20 md:-translate-x-1/2 md:-translate-y-1/2"
                style={{
                  top: stop.top,
                  left: stop.left,
                }}
                onClick={() => {
                  if (stop.path) navigate(stop.path);
                  else if (stop.url) window.open(stop.url, '_blank');
                }}
              >
                <div className="relative w-12 h-12 bg-white border-2 border-border-gray rounded-full flex items-center justify-center text-blue-main shadow-main shrink-0">
                  <span className="material-icons text-2xl leading-none">
                    {stop.icon}
                  </span>
                  <span className="absolute -top-1 -right-1 bg-saffron text-blue-main text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {stop.id}
                  </span>
                </div>
                <div className="text-sm font-bold text-center md:bg-white/90 md:px-2 md:py-0.5 md:rounded md:shadow-sm">
                  {t(`journey_stops.${stop.key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-8 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-blue-main mb-10 font-playfair">
          {t('awareness.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className="card group cursor-pointer flex flex-col items-center justify-center text-center relative pt-8"
              onClick={() => {
                if (card.path) navigate(card.path);
                else if (card.action === 'openChat') {
                  window.dispatchEvent(new CustomEvent('open-chatbot'));
                }
              }}
            >
              {card.badgeKey && (
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${card.badgeColor}`}
                >
                  {t(`features.${card.badgeKey}`)}
                </span>
              )}
              <span className="material-icons text-4xl text-blue-main mb-4 group-hover:scale-110 transition-transform">
                {card.icon}
              </span>
              <h3 className="font-bold text-lg">{t(`features.${card.key}`)}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-main font-playfair mb-4">
            {t('faq.section_title')}
          </h2>
          <p className="text-muted">{t('faq.section_subtitle')}</p>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, index) => (
            <div
              key={index}
              className="card p-0 overflow-hidden border border-border-gray"
            >
              <button
                className="w-full text-left p-6 flex justify-between items-center bg-white hover:bg-bg-main transition-colors"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-bold text-blue-main">
                  {t(`faq_items.${faq.k}.q`)}
                </span>
                <span
                  className={`material-icons transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40' : 'max-h-0'}`}
              >
                <div className="p-6 text-muted border-t border-border-gray bg-bg-main/30">
                  {t(`faq_items.${faq.k}.a`)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            className="text-blue-main font-bold hover:underline inline-flex items-center gap-2"
            onClick={() => navigate('/faq')}
          >
            {t('faq.see_all')}{' '}
            <span className="material-icons" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      </section>
    </main>
  );
};

Home.propTypes = {};

export default Home;
