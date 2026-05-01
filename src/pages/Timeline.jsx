import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logTimelineViewed } from '../utils/analytics';

const Timeline = () => {
  const { t } = useTranslation();
  useEffect(() => {
    logTimelineViewed();
  }, []);

  const events = [
    {
      title: t('timeline.reg_title'),
      icon: 'app_registration',
      desc: t('timeline.reg_desc'),
      action: 'Check if your name is on the roll at voters.eci.gov.in.',
    },
    {
      title: t('timeline.nom_title'),
      icon: 'assignment',
      desc: t('timeline.nom_desc'),
      action: 'Research candidates contesting from your constituency.',
    },
    {
      title: t('timeline.cam_title'),
      icon: 'campaign',
      desc: t('timeline.cam_desc'),
      action: 'Evaluate candidates. Report MCC violations via cVIGIL.',
    },
    {
      title: t('timeline.sil_title'),
      icon: 'do_not_disturb',
      desc: t('timeline.sil_desc'),
      action: 'Make your final decision. Prepare your documents.',
    },
    {
      title: t('timeline.pol_title'),
      icon: 'how_to_vote',
      desc: t('timeline.pol_desc'),
      action: 'Carry your voter ID and booth slip. Vote confidently.',
    },
    {
      title: t('timeline.res_title'),
      icon: 'bar_chart',
      desc: t('timeline.res_desc'),
      action: 'Watch results on official ECI channels.',
    },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-4xl mx-auto py-10 px-6"
    >
      <div className="flex justify-start mb-6">
        <Link
          to="/"
          className="text-blue-main flex items-center gap-2 hover:underline font-bold text-sm"
        >
          <span className="material-icons text-sm">arrow_back</span> Back to
          Home
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-blue-main text-center font-playfair mb-2">
        {t('timeline.title')}
      </h1>
      <p className="text-muted text-center mb-12">{t('timeline.subtitle')}</p>

      <div className="card bg-saffron text-blue-main text-center py-6 mb-16">
        <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">
          Target: General Elections 2026
        </p>
        <div className="text-5xl font-black font-playfair">365 Days Left</div>
        <p className="text-sm font-medium mt-2">Time to prepare your vote!</p>
      </div>

      <div className="relative border-l-4 border-blue-pale ml-4 space-y-12">
        {events.map((ev, i) => (
          <div key={i} className="relative pl-10">
            <div className="absolute -left-[20px] top-0 w-10 h-10 bg-white border-4 border-blue-main rounded-full flex items-center justify-center text-blue-main">
              <span className="material-icons text-sm">{ev.icon}</span>
            </div>
            <div className="bg-white p-6 rounded-radius border border-border-gray shadow-sm group hover:border-blue-main transition-colors">
              <h4 className="font-bold text-lg text-blue-main mb-2">
                {ev.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed mb-4">
                {ev.desc}
              </p>
              <div className="p-3 bg-blue-pale/50 rounded text-[11px] font-bold text-blue-main flex items-center gap-2">
                <span className="material-icons text-xs">info</span>
                {ev.action}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

Timeline.propTypes = {};

export default Timeline;
