import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Public Notice',
    desc: 'The RO (Returning Officer) issues a public notice inviting nominations.',
  },
  {
    title: 'Security Deposit',
    desc: 'Candidates must deposit ₹25,000 for General and ₹12,500 for SC/ST seats.',
  },
  {
    title: 'Submission',
    desc: 'Nomination forms must be filed between 11 AM and 3 PM.',
  },
  {
    title: 'Affidavit (Form 26)',
    desc: 'Mandatory disclosure of assets, educational qualifications, and criminal records.',
  },
  {
    title: 'Scrutiny',
    desc: 'The RO checks all forms for errors or disqualifications.',
  },
  {
    title: 'Withdrawal',
    desc: 'Candidates have 2 days to withdraw if they change their mind.',
  },
];

const Nomination = () => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-4xl mx-auto py-12 px-6 space-y-12"
    >
      <div className="flex justify-start">
        <Link
          to="/"
          className="text-blue-main flex items-center gap-2 hover:underline font-bold text-sm"
        >
          <span className="material-icons text-sm">arrow_back</span> Back to
          Home
        </Link>
      </div>
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-blue-main font-playfair">
          Nomination Guide
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-lg">
          The process of how a citizen officially becomes a candidate for the
          Indian General Elections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-border-gray rounded-radius shadow-sm hover:border-blue-main transition-all group"
          >
            <div className="w-10 h-10 bg-blue-pale text-blue-main rounded-full flex items-center justify-center font-bold mb-4 group-hover:bg-blue-main group-hover:text-white transition-colors">
              {i + 1}
            </div>
            <h3 className="font-bold text-lg text-blue-main mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-pale p-8 rounded-2xl border-2 border-dashed border-blue-main/20 flex flex-col items-center text-center gap-4">
        <span className="material-icons text-blue-main text-5xl">
          fact_check
        </span>
        <h2 className="text-2xl font-bold text-blue-main font-playfair">
          Eligibility for Candidates
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-ink max-w-xl">
          <li className="list-none flex items-center gap-2">
            <span className="material-icons text-green-main text-sm">
              check_circle
            </span>{' '}
            Must be a Citizen of India
          </li>
          <li className="list-none flex items-center gap-2">
            <span className="material-icons text-green-main text-sm">
              check_circle
            </span>{' '}
            Minimum 25 years of age
          </li>
          <li className="list-none flex items-center gap-2">
            <span className="material-icons text-green-main text-sm">
              check_circle
            </span>{' '}
            Must be an elector in any constituency
          </li>
          <li className="list-none flex items-center gap-2">
            <span className="material-icons text-green-main text-sm">
              check_circle
            </span>{' '}
            Not holding an Office of Profit
          </li>
        </div>
      </div>
    </main>
  );
};

Nomination.propTypes = {};

export default Nomination;
