import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../utils/constants';

const Guidance = () => {
  const { t } = useTranslation();

  const eligibilityItems = [
    { icon: 'public', label: t('guide.e_citizen') },
    { icon: 'cake', label: t('guide.e_age') },
    { icon: 'home', label: t('guide.e_residence') },
    { icon: 'rule', label: t('guide.e_unregistered') },
  ];

  const docCategories = [
    {
      title: t('guide.docs_identity'),
      options: t('guide.docs_options_id'),
      icon: 'fingerprint',
    },
    {
      title: t('guide.docs_address'),
      options: t('guide.docs_options_address'),
      icon: 'map',
    },
    {
      title: t('guide.docs_age'),
      options: t('guide.docs_options_age'),
      icon: 'calendar_today',
    },
    {
      title: t('guide.docs_photo'),
      options: t('guide.docs_photo'),
      icon: 'photo_camera',
    },
  ];

  const onlineSteps = [
    t('guide.step_portal'),
    t('guide.step_form6'),
    t('guide.step_details'),
    t('guide.step_upload'),
    t('guide.step_submit'),
  ];

  const mistakes = [
    t('guide.mistakes_address'),
    t('guide.mistakes_docs'),
    t('guide.mistakes_duplicate'),
    t('guide.mistakes_mismatch'),
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-bg-main min-h-screen pb-20"
    >
      {/* Hero Section */}
      <div className="bg-blue-main text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-20 -translate-y-20">
          <span className="material-icons text-[400px]">how_to_reg</span>
        </div>
        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-blue-pale font-bold hover:text-white transition-colors"
          >
            <span className="material-icons text-sm">arrow_back</span>{' '}
            {t('nav.home')}
          </Link>
          <h1 className="text-5xl font-extrabold font-playfair">
            {t('guide.title')}
          </h1>
          <p className="text-xl text-blue-pale max-w-2xl">
            {t('guide.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 space-y-12">
        {/* Intro Card */}
        <div className="card bg-white p-8 border-l-8 border-saffron shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-icons text-6xl text-blue-main">info</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-main mb-4 flex items-center gap-3">
            {t('guide.voter_id_q')}
          </h2>
          <p className="text-lg text-ink leading-relaxed">
            {t('guide.voter_id_a')}
          </p>
        </div>

        {/* Eligibility Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-blue-main font-playfair text-center">
            {t('guide.eligibility_title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {eligibilityItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-blue-pale/20 text-center hover:bg-blue-pale/10 transition-colors"
              >
                <span className="material-icons text-4xl text-saffron mb-3">
                  {item.icon}
                </span>
                <p className="font-bold text-blue-main">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-blue-pale/20 rounded-[40px] p-10 space-y-8">
          <h2 className="text-3xl font-bold text-blue-main font-playfair text-center">
            {t('guide.docs_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {docCategories.map((doc, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-6 bg-white rounded-3xl shadow-sm border border-white hover:border-blue-main transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-main text-white flex items-center justify-center shrink-0">
                  <span className="material-icons">{doc.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-blue-main mb-1 text-lg">
                    {doc.title}
                  </h4>
                  <p className="text-muted text-sm italic">{doc.options}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Method Section */}
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-4 bg-saffron/10 p-4 rounded-2xl">
              <span className="material-icons text-saffron text-3xl">
                language
              </span>
              <h3 className="text-2xl font-bold text-blue-main">
                {t('guide.apply_online')}
              </h3>
            </div>

            <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-blue-pale">
              {onlineSteps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col gap-1 group">
                  <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-blue-main text-white text-[10px] flex items-center justify-center font-bold border-4 border-white z-10 group-hover:scale-125 transition-transform">
                    {idx + 1}
                  </div>
                  <p className="text-lg font-bold text-blue-main">{step}</p>
                  {idx === 0 && (
                    <a
                      href="https://voters.eci.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      voters.eci.gov.in{' '}
                      <span className="material-icons text-xs">
                        open_in_new
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[30px] shadow-lg border border-blue-pale/30 space-y-6">
              <h3 className="text-2xl font-bold text-blue-main flex items-center gap-3">
                <span className="material-icons">store_mall_directory</span>{' '}
                {t('guide.apply_offline')}
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-icons text-blue-main">
                    check_circle
                  </span>
                  <span className="font-medium text-ink">
                    {t('guide.offline_visit')}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="material-icons text-blue-main">
                    check_circle
                  </span>
                  <span className="font-medium text-ink">
                    {t('guide.offline_form')}
                  </span>
                </li>
              </ul>

              <div className="pt-6 border-t border-blue-pale/30 text-center">
                <h4 className="font-bold text-blue-main mb-4">
                  {t('guide.processing_title')}
                </h4>
                <div className="flex justify-around items-center">
                  <div className="text-center">
                    <span className="text-3xl font-black text-saffron block">
                      2-4
                    </span>
                    <span className="text-xs uppercase font-bold tracking-widest opacity-60">
                      {t('guide.time_title')}
                    </span>
                  </div>
                  <div className="h-10 w-[1px] bg-blue-pale"></div>
                  <div className="max-w-[120px] text-xs font-medium text-muted">
                    {t('guide.time_desc')}
                  </div>
                </div>
              </div>
            </div>

            {/* After Approval */}
            <div className="bg-gradient-to-br from-blue-main to-indigo-900 p-8 rounded-[30px] text-white space-y-4 shadow-xl">
              <h3 className="text-xl font-bold font-playfair flex items-center gap-3">
                <span className="material-icons text-saffron">stars</span>{' '}
                {t('guide.approval_title')}
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                {t('guide.approval_desc')}
              </p>
              <button className="w-full bg-white text-blue-main py-3 rounded-xl font-bold hover:bg-blue-pale transition-colors text-sm">
                {t('nav.locator')}
              </button>
            </div>
          </div>
        </div>

        {/* Common MistakesSection */}
        <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-10 space-y-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <span className="material-icons text-[200px] text-red-main">
              warning
            </span>
          </div>
          <h2 className="text-3xl font-bold text-red-main font-playfair">
            {t('guide.mistakes_title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 relative z-10">
            {mistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-red-50 group hover:bg-white transition-all"
              >
                <span className="material-icons text-red-main group-hover:scale-110 transition-transform">
                  cancel
                </span>
                <span className="font-bold text-blue-main">{mistake}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};


export default Guidance;
