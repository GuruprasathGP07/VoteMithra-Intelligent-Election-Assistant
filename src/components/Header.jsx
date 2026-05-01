import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ currentLanguage, onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.simulator'), path: '/simulator' },
    { name: t('nav.detector'), path: '/fakenews' },
    { name: t('nav.rights'), path: '/protection' },
    { name: t('nav.quiz'), path: '/quiz' },
    { name: t('nav.locator'), path: '/locator' },
    { name: t('nav.guide'), path: '/guide' },
  ];

  // Close menu on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const activeLang = currentLanguage || i18n.language;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 h-16 bg-white z-[1000] flex items-center justify-between px-4 md:px-8 shadow-sm border-b border-border-gray"
        role="banner"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-main hover:opacity-80 transition-opacity focus:ring-2 focus:ring-blue-main focus:ring-offset-2 rounded"
          aria-label="VoteMitra Home"
        >
          <span className="material-icons" aria-hidden="true">
            how_to_vote
          </span>
          <span className="font-playfair text-xl font-bold">VoteMitra</span>
        </Link>

        <nav
          className="hidden md:flex gap-6 items-center"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-ink hover:text-blue-main transition-colors focus:ring-2 focus:ring-blue-main focus:ring-offset-2 rounded px-1"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="tel:1950"
            className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 border-b-2 border-red-600/30 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded px-1"
            aria-label={'Emergency Helpline: 1950'}
          >
            <span className="material-icons text-base" aria-hidden="true">
              emergency
            </span>
            {t('nav.emergency')}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="hidden sm:inline-flex bg-saffron text-blue-main font-bold py-2 px-4 rounded-md text-sm shadow-sm hover:brightness-105 transition-all focus:ring-2 focus:ring-saffron focus:ring-offset-2"
            onClick={() => navigate('/simulator')}
          >
            ▶ {t('nav.demo')}
          </button>

          <div aria-label="Select Language">
            <LanguageSwitcher
              currentLang={activeLang}
              onChange={onLanguageChange}
            />
          </div>

          <button
            className="md:hidden text-ink p-2 focus:ring-2 focus:ring-blue-main rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open navigation menu'}
          >
            <span className="material-icons" aria-hidden="true">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="absolute top-16 left-0 right-0 bg-white p-4 md:hidden flex flex-col gap-4 shadow-main border-t border-border-gray text-center animate-slideDown"
            role="navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:bg-blue-pale text-ink hover:text-blue-main rounded font-medium transition-colors focus:bg-blue-pale"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:1950"
              className="py-2 text-red-600 font-bold bg-red-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.emergency')}
            </a>
          </div>
        )}
      </header>
    </>
  );
};

Header.propTypes = {
  currentLanguage: PropTypes.string,
  onLanguageChange: PropTypes.func,
};

Header.defaultProps = {
  currentLanguage: '',
  onLanguageChange: () => {},
};

export default Header;
