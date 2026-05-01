import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary catches React render errors and shows a fallback UI.
 * Wrap around any route or component that might fail.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in dev; replace with analytics in prod
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          id="main-content"
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="max-w-md">
            <div className="text-6xl mb-4" aria-hidden="true">
              ⚠️
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              VoteMithra encountered an error. Your data is safe.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors mr-3"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
