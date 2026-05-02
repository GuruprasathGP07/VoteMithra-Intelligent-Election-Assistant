import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

const Candidates = () => {
  const { t } = useTranslation();

  const resources = [
    {
      title: 'Know Your Candidate (KYC) App',
      desc: 'Official mobile application by ECI to view candidate affidavits, assets, and criminal antecedents.',
      icon: 'smartphone',
      links: [
        {
          label: 'Android',
          url: 'https://play.google.com/store/apps/details?id=com.eci.kyc',
        },
        {
          label: 'iOS',
          url: 'https://apps.apple.com/in/app/kyc-eci/id1455931215',
        },
      ],
    },
    {
      title: 'Affidavit Portal',
      desc: 'Web portal to search and download digitized affidavits of all contesting candidates.',
      icon: 'description',
      links: [{ label: 'Visit Portal', url: 'https://affidavit.eci.gov.in/' }],
    },
    {
      title: 'Voter Helpline',
      desc: 'Search for candidates by constituency or EPIC number.',
      icon: 'person_search',
      links: [{ label: 'Search Now', url: 'https://voters.eci.gov.in/' }],
    },
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
          <span className="material-icons text-[400px]">person_search</span>
        </div>
        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-pale font-bold hover:text-white transition-colors"
          >
            <span className="material-icons text-sm">arrow_back</span>{' '}
            {t('nav.home')}
          </Link>
          <h1 className="text-5xl font-extrabold font-playfair">
            {t('features.candidate_kyc')}
          </h1>
          <p className="text-xl text-blue-pale max-w-2xl">
            Empowering you to make an informed choice by knowing who is
            contesting in your constituency.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((res, idx) => (
            <div
              key={idx}
              className="card bg-white p-8 flex flex-col h-full hover:shadow-2xl transition-all border-none"
            >
              <div className="w-16 h-16 bg-blue-main/5 rounded-2xl flex items-center justify-center text-blue-main mb-6">
                <span className="material-icons text-4xl">{res.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-main mb-3">
                {res.title}
              </h3>
              <p className="text-muted text-sm mb-8 flex-grow leading-relaxed">
                {res.desc}
              </p>
              <div className="flex flex-wrap gap-3">
                {res.links.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 px-4 bg-blue-main text-white text-xs font-bold rounded-lg hover:bg-blue-dark transition-colors shadow-lg shadow-blue-main/20"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="card bg-saffron/10 p-8 border-l-8 border-saffron flex gap-6 items-start">
          <span className="material-icons text-4xl text-saffron">
            fact_check
          </span>
          <div>
            <h4 className="text-lg font-bold text-blue-main mb-2">
              Why KYC is Important?
            </h4>
            <p className="text-sm text-ink leading-relaxed">
              The Supreme Court of India has mandated that all candidates must
              disclose their criminal records, financial assets, and educational
              qualifications. Checking these details helps you ensure that you
              are voting for a candidate who aligns with your values and
              expectations for public service.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

Candidates.propTypes = {
  // Candidate page props
};

export default Candidates;
