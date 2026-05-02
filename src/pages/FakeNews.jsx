import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { detectFakeNewsCloud } from '../utils/gemini';
import { logFakeNewsCheck } from '../utils/analytics';
import { logger } from '../utils/logger';

const FakeNews = () => {
  const [phase, setPhase] = useState(1);
  const [currentSwipe, setCurrentSwipe] = useState(0);
  const [swipeScore, setSwipeScore] = useState(0);
  const [swipeFeedback, setSwipeFeedback] = useState(null);

  const [customInput, setCustomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const swipes = [
    {
      id: 1,
      text: 'ðŸš¨ URGENT: Voting date for your area has been CHANGED to tomorrow. Spread this to all voters. This is official.',
      type: 'FAKE',
      explanation:
        'ECI never changes voting dates via WhatsApp. Verify at eci.gov.in.',
    },
    {
      id: 2,
      text: 'âš ï¸ Breaking: EVMs in 5 states found pre-loaded with votes. Supreme Court ordered re-election. Forward urgently.',
      type: 'FAKE',
      explanation:
        'No such Supreme Court order exists. Common misinformation pattern.',
    },
    {
      id: 3,
      text: 'Your EPIC number is required to vote. Without it you CANNOT enter the booth.',
      type: 'FAKE',
      explanation:
        'Partially false. 12 alternative documents are accepted by ECI. Voter ID is not the only option.',
    },
  ];

  const handleSwipe = (choice) => {
    const current = swipes[currentSwipe];
    const isCorrect = choice === current.type;
    if (isCorrect) setSwipeScore((prev) => prev + 1);
    setSwipeFeedback({ isCorrect, explanation: current.explanation });
  };

  const nextSwipe = () => {
    if (currentSwipe < swipes.length - 1) {
      setCurrentSwipe((prev) => prev + 1);
      setSwipeFeedback(null);
    } else {
      setPhase(2);
    }
  };

  // Helper: map verdict to risk level label
  const getRiskLevel = (verdict = '') => {
    const v = verdict.toUpperCase();
    if (v === 'SAFE') return 'SAFE';
    if (v === 'FAKE') return 'FAKE';
    return 'SUSPICIOUS';
  };

  // Helper: risk level â†’ colour classes
  const getRiskColors = (riskLevel) => {
    if (riskLevel === 'SAFE')
      return {
        border: 'border-green-500',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-700',
      };
    if (riskLevel === 'FAKE')
      return {
        border: 'border-red-500',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
      };
    return {
      border: 'border-yellow-500',
      text: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-700',
    };
  };

  // Helper: recommended action based on verdict
  const getRecommendedAction = (riskLevel) => {
    if (riskLevel === 'SAFE')
      return 'This content appears credible. Always cross-check with official ECI sources.';
    if (riskLevel === 'FAKE')
      return 'Do NOT share this message. Report it via cVIGIL app or call 1950.';
    return 'Exercise caution before sharing. Verify with eci.gov.in or official news sources.';
  };

  const analyzeMessage = async () => {
    if (!customInput.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    logFakeNewsCheck();

    try {
      const result = await detectFakeNewsCloud(customInput);

      // âœ… Normalize response â€” handles both old and new Gemini response shapes
      const riskLevel = getRiskLevel(result.verdict || result.riskLevel);
      const trustScore =
        typeof result.score === 'number'
          ? result.score
          : typeof result.trustScore === 'number'
            ? result.trustScore
            : 50;

      setAnalysisResult({
        trustScore,
        riskLevel,
        explanation:
          result.reasoning || result.explanation || 'Analysis complete.',
        flaggedKeywords: result.flaggedKeywords || [],
        recommendedAction:
          result.recommendedAction || getRecommendedAction(riskLevel),
      });
    } catch (error) {
      logger.error('Analysis error:', error);
      setAnalysisError(
        'Analysis failed. Please check your internet connection and try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main
      data-testid="fake-news-page"
      id="main-content"
      tabIndex={-1}
      className="max-w-4xl mx-auto py-10 px-6 space-y-10"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-main font-playfair">
          Fake News Detector
        </h1>
        <p className="text-muted">
          Can you spot misinformation? Use AI to protect yourself.
        </p>
      </div>

      {/* â”€â”€ Phase 1: Swipe Challenge â”€â”€ */}
      {phase === 1 && (
        <div
          className="card max-w-lg mx-auto animate-fadeIn"
          role="region"
          aria-label="Swipe Challenge"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Swipe Challenge</h3>
            <span
              className="text-sm font-bold text-saffron"
              aria-label={`Question ${currentSwipe + 1} of ${swipes.length}`}
            >
              {currentSwipe + 1} / {swipes.length}
            </span>
          </div>

          {!swipeFeedback ? (
            <div className="space-y-6">
              <div
                className="bg-[#E1FCEF] p-6 rounded-radius border border-[#A1E8C6] drop-shadow-sm"
                role="article"
              >
                <div className="flex items-center gap-2 text-[10px] text-[#064E3B] font-bold uppercase mb-2">
                  <span className="material-icons text-xs" aria-hidden="true">
                    forward
                  </span>
                  Forwarded many times
                </div>
                <p className="text-[#064E3B] font-medium leading-relaxed">
                  {swipes[currentSwipe].text}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="btn-secondary flex-1 border-red-500 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
                  onClick={() => handleSwipe('FAKE')}
                  aria-label="Mark as Fake"
                >
                  FAKE ðŸ‘Ž
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1 border-green-500 text-green-600 hover:bg-green-50 focus:ring-2 focus:ring-green-500"
                  onClick={() => handleSwipe('REAL')}
                  aria-label="Mark as Real"
                >
                  REAL ðŸ‘
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6" aria-live="polite">
              <div
                className={`p-4 rounded-radius text-center font-bold text-lg ${swipeFeedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {swipeFeedback.isCorrect ? 'âœ“ Correct!' : 'âœ— Incorrect'}
              </div>
              <p className="text-sm text-center italic">
                {swipeFeedback.explanation}
              </p>
              <button
                type="button"
                className="btn-primary w-full focus:ring-4"
                onClick={nextSwipe}
              >
                {currentSwipe === swipes.length - 1
                  ? 'Go to Custom AI Scanner'
                  : 'Next Message â†’'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* â”€â”€ Phase 2: Custom AI Scanner â”€â”€ */}
      {phase === 2 && (
        <div
          className="card max-w-2xl mx-auto animate-fadeIn"
          role="region"
          aria-label="Custom AI Scanner"
        >
          <h3 className="text-xl font-bold mb-2">Custom AI Message Scanner</h3>
          <p className="text-sm text-muted mb-6">
            Paste any election-related message to analyze its credibility using
            Gemini AI.
          </p>

          <div className="space-y-4">
            <label htmlFor="news-input" className="sr-only">
              Paste news message here
            </label>
            <textarea
              id="news-input"
              className="input-control min-h-[120px] focus:ring-2 focus:ring-blue-main"
              placeholder="Example: ðŸš¨ Breaking - Voting dates have been changed by official order..."
              maxLength={2000}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              aria-label="Paste election message to analyze"
            />

            <button
              type="button"
              className="btn-primary w-full h-12 focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={analyzeMessage}
              disabled={isAnalyzing || !customInput.trim()}
              aria-busy={isAnalyzing}
              aria-label={
                isAnalyzing
                  ? 'Analyzing news content with AI...'
                  : 'Analyze news content with Gemini AI'
              }
            >
              {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with Gemini AI'}
            </button>
          </div>

          {/* âœ… Error message â€” no more alert() popup */}
          {analysisError && (
            <div
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-radius text-red-700 text-sm flex items-center gap-2"
              role="alert"
            >
              <span className="material-icons text-base" aria-hidden="true">
                error_outline
              </span>
              {analysisError}
            </div>
          )}

          {/* â”€â”€ Analysis Result â”€â”€ */}
          <div aria-live="polite">
            {analysisResult &&
              (() => {
                const colors = getRiskColors(analysisResult.riskLevel);
                return (
                  <div className="mt-10 pt-10 border-t border-border-gray animate-fadeIn space-y-6">
                    {/* Score circle + verdict */}
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-24 h-24 rounded-full border-8 flex items-center justify-center text-2xl font-black ${colors.border} ${colors.text}`}
                        aria-label={`Trust score: ${analysisResult.trustScore} out of 100`}
                      >
                        {analysisResult.trustScore}
                      </div>
                      <div>
                        <div
                          className={`inline-block px-3 py-1 rounded text-xs font-bold mb-2 uppercase tracking-widest ${colors.badge}`}
                        >
                          {analysisResult.riskLevel}
                        </div>
                        <p className="font-medium">
                          {analysisResult.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Highlighted message */}
                    <div className="bg-bg-main p-4 rounded-radius space-y-2">
                      <p className="text-xs font-bold text-muted uppercase">
                        Analyzed Message
                      </p>
                      <p className="text-sm italic text-muted leading-relaxed">
                        {customInput.split(' ').map((word, i) => {
                          const isFlagged =
                            analysisResult.flaggedKeywords?.some((kw) =>
                              word.toLowerCase().includes(kw.toLowerCase())
                            );
                          return (
                            <span
                              key={i}
                              className={
                                isFlagged
                                  ? 'bg-red-100 text-red-700 px-0.5 rounded'
                                  : ''
                              }
                            >
                              {word}{' '}
                            </span>
                          );
                        })}
                      </p>
                    </div>

                    {/* Recommended action */}
                    <div className="bg-blue-pale p-4 rounded-radius flex items-center gap-3 text-blue-main font-bold">
                      <span className="material-icons" aria-hidden="true">
                        info
                      </span>
                      <span className="text-sm">
                        {analysisResult.recommendedAction}
                      </span>
                    </div>

                    {/* Analyze another */}
                    <button
                      type="button"
                      className="btn-secondary w-full"
                      onClick={() => {
                        setAnalysisResult(null);
                        setCustomInput('');
                        setAnalysisError(null);
                      }}
                    >
                      Analyze Another Message
                    </button>
                  </div>
                );
              })()}
          </div>
        </div>
      )}
    </main>
  );
};


export default FakeNews;
