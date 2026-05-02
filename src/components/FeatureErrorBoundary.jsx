/**
 * @fileoverview Feature-level error boundary for VoteMithra.
 * Prevents a single feature failure from crashing the entire page.
 * @module components/FeatureErrorBoundary
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * FeatureErrorBoundary — catches errors in individual features.
 * Shows a compact fallback so the rest of the page stays functional.
 *
 * @example
 * <FeatureErrorBoundary featureName="EVM Simulator">
 *   <EVMSimulator />
 * </FeatureErrorBoundary>
 */
class FeatureErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Logs feature crashes in development mode only.
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} info - Component stack trace.
   */
  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(`[${this.props.featureName}] crashed:`, error, info);
    }
  }

  render() {
    // ✅ ES6 default parameter — replaces deprecated defaultProps
    const { featureName = 'This feature', children } = this.props;

    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center p-6 text-center bg-red-50 rounded-xl border border-red-200"
        >
          <span className="text-2xl mb-2" aria-hidden="true">
            ⚠️
          </span>
          <p className="text-sm font-semibold text-red-700">
            {featureName} is temporarily unavailable
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-xs text-red-600 underline hover:text-red-800"
            aria-label={`Retry ${featureName}`}
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

FeatureErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  featureName: PropTypes.string,
};

export default FeatureErrorBoundary;