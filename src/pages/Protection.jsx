import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../utils/constants';

const Protection = () => {
  const { t } = useTranslation();

  const electionTypes = [
    {
      key: 'ls',
      icon: 'account_balance',
      type: t('protection.direct'),
      color: 'bg-blue-600',
    },
    {
      key: 'vs',
      icon: 'location_city',
      type: t('protection.direct'),
      color: 'bg-indigo-600',
    },
    {
      key: 'rs',
      icon: 'gavel',
      type: t('protection.indirect'),
      color: 'bg-saffron',
    },
    {
      key: 'lb',
      icon: 'groups',
      type: t('protection.direct'),
      color: 'bg-teal-600',
    },
  ];

  const coreLaws = [
    { key: 'rp1950', icon: 'filter_1' },
    { key: 'rp1951', icon: 'filter_2' },
    { key: 'rules1961', icon: 'filter_3' },
  ];

  const voterRights = [
    { key: 'secret_ballot', icon: 'visibility_off' },
    { key: 'rti', icon: 'info' },
    { key: 'tendered', icon: 'how_to_reg' },
    { key: 'nota', icon: 'block' },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-bg-main min-h-screen pb-20"
    >
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-20">
        {/* Header Section */}
        <div className="space-y-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-blue-main font-bold hover:underline mb-4"
          >
            <span className="material-icons text-sm">arrow_back</span>{' '}
            {t('nav.home')}
          </Link>
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold text-blue-main font-playfair tracking-tight">
              {t('rights.title')}
            </h1>
            <p className="text-muted text-xl max-w-3xl mx-auto leading-relaxed">
              {t('protection.types_subtitle')}
            </p>
          </div>
        </div>

        {/* Section 1: Election Classifications */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-saffron rounded-full"></div>
            <h2 className="text-3xl font-bold text-blue-main font-playfair">
              {t('protection.types_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {electionTypes.map((item) => (
              <div
                key={item.key}
                className="relative group overflow-hidden bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-blue-pale/20"
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-700`}
                ></div>
                <div
                  className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-main/20`}
                >
                  <span className="material-icons text-3xl">{item.icon}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted opacity-60 block mb-2">
                  {item.type}
                </span>
                <h3 className="text-xl font-bold text-blue-main mb-3 font-playfair">
                  {t(`protection.${item.key}_title`)}
                </h3>
                <p className="text-ink text-sm leading-relaxed opacity-80">
                  {t(`protection.${item.key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Constitutional Pillars (Laws) */}
        <div className="bg-blue-main rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="relative z-10 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-3xl font-bold font-playfair">
                {t('protection.laws_title')}
              </h2>
              <p className="text-blue-pale/80 text-lg leading-relaxed">
                {t('protection.laws_subtitle')}
              </p>
              <div className="pt-6">
                <span className="material-icons text-8xl text-white/10">
                  gavel
                </span>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {coreLaws.map((law) => (
                <div
                  key={law.key}
                  className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-saffron text-blue-main flex items-center justify-center shrink-0">
                    <span className="material-icons">{law.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 group-hover:text-saffron transition-colors">
                      {t(`protection.${law.key}_title`)}
                    </h4>
                    <p className="text-blue-pale/70 text-sm leading-relaxed">
                      {t(`protection.${law.key}_desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Essential Rights */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-blue-main rounded-full"></div>
            <h2 className="text-3xl font-bold text-blue-main font-playfair">
              {t('protection.rti_title')} & {t('protection.secret_ballot')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {voterRights.map((right) => (
              <div
                key={right.key}
                className="flex items-start gap-6 p-8 bg-white rounded-3xl border-b-4 border-blue-pale hover:border-saffron transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-blue-pale text-blue-main flex items-center justify-center shrink-0 group-hover:bg-saffron group-hover:text-blue-main transition-all duration-300">
                  <span className="material-icons text-2xl">{right.icon}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-blue-main font-playfair">
                    {t(`protection.${right.key}_title`)}
                  </h3>
                  <p className="text-ink text-sm leading-relaxed opacity-80">
                    {t(`protection.${right.key}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-saffron to-amber-500 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-blue-main">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold font-playfair">
              {t('rights.mcc_title')}
            </h2>
            <p className="font-medium opacity-80">{t('rights.mcc_desc')}</p>
          </div>
          <button className="bg-blue-main text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
            {t('rights.cvigil_btn')}
          </button>
        </div>
      </div>
    </main>
  );
};

Protection.propTypes = {
  // Page component props
};

export default Protection;
