/**
 * @fileoverview JourneyStep component for the voter journey map.
 * Represents a single stop on the visual voter journey in Home page.
 * @module components/JourneyStep
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * JourneyStep — single interactive stop on the voter journey map.
 * @param {Object} props
 * @param {number} props.step - Step number (1-9).
 * @param {string} props.title - Step title.
 * @param {string} props.description - Brief description.
 * @param {string} props.icon - Emoji or icon string.
 * @param {boolean} [props.completed] - Whether this step is completed.
 * @param {Function} props.onClick - Click handler for navigation.
 * @returns {JSX.Element} Animated journey step card.
 */
const JourneyStep = memo(function JourneyStep({
  step,
  title,
  description,
  icon,
  completed = false,
  onClick,
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Step ${step}: ${title}${completed ? ' (completed)' : ''}`}
      className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer text-left w-full
        ${
          completed
            ? 'border-green-400 bg-green-50'
            : 'border-orange-200 bg-white hover:border-orange-400 hover:bg-orange-50'
        }`}
    >
      <span className="text-3xl mb-2" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs font-bold text-orange-500 mb-1">
        {step}
      </span>
      <span className="text-sm font-semibold text-gray-800 mb-1">{title}</span>
      <span className="text-xs text-gray-500 text-center">{description}</span>
      {completed && (
        <span className="mt-2 text-xs text-green-600 font-semibold">âœ“ Done</span>
      )}
    </motion.button>
  );
});

JourneyStep.propTypes = {
  step: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default JourneyStep;
