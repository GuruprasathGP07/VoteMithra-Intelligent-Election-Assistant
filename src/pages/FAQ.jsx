import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faqs } from '../data/faqData';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-3xl mx-auto py-10 px-6"
    >
      <h1 className="text-3xl font-bold text-blue-main text-center font-playfair mb-10">
        {t('faq.page_title')}
      </h1>
      <div className="card divide-y divide-border-gray p-0 overflow-hidden">
        {faqs.map((faq, i) => (
          <div key={i} className="group">
            <button
              className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-bg-main transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-bold text-blue-main text-sm md:text-base">
                {t(`faq_items.${faq.k}.q`)}
              </span>
              <span
                className={`material-icons transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                expand_more
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 bg-bg-main/30 ${openIndex === i ? 'max-h-40' : 'max-h-0'}`}
            >
              <div className="p-5 text-sm md:text-base text-muted border-t border-border-gray">
                {t(`faq_items.${faq.k}.a`)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

FAQ.propTypes = {
  // FAQ page props
};

export default FAQ;
