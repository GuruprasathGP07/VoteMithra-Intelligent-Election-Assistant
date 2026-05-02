import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import ProgressBar from '../components/ProgressBar';
import { logQuizStarted, logQuizCompleted } from '../utils/analytics';
import { logger } from '../utils/logger';

const Quiz = () => {
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const certRef = useRef(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `Voter_Certificate_${userName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const text = `I scored ${score}/10 on the VoteMitra Election Quiz! I'm now a certified ${score === 10 ? 'Election Champion' : score >= 8 ? 'Active Citizen' : 'Informed Voter'}. Test your knowledge too!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VoteMitra Certificate',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        logger.error('Error sharing:', err);
      }
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
      window.open(url, '_blank');
    }
  };

  const questions = [
    {
      q: 'What is the minimum age to vote in India?',
      a: ['16', '18', '21', '25'],
      correct: 1,
      exp: 'Article 326 guarantees voting rights to all citizens above 18 years.',
    },
    {
      q: 'How many alternative documents does ECI accept instead of Voter ID?',
      a: ['5', '8', '12', '15'],
      correct: 2,
      exp: 'ECI accepts 12 photo identity documents including Aadhaar and Passport.',
    },
    {
      q: 'What is a VVPAT?',
      a: [
        'Verification App',
        'Paper Audit Trail',
        'Voting System',
        'Candidate Tracker',
      ],
      correct: 1,
      exp: 'VVPAT shows a paper slip of your vote for 7 seconds for verification.',
    },
    {
      q: 'When does the Model Code of Conduct come into effect?',
      a: [
        'Polling Day',
        'Result Day',
        'Election Announcement Date',
        '48 hours before',
      ],
      correct: 2,
      exp: 'The MCC starts from the date of announcement of the election schedule.',
    },
    {
      q: 'Can an EVM be connected to the internet?',
      a: [
        'Yes via WiFi',
        'Yes via Bluetooth',
        'Only on polling day',
        'No, never',
      ],
      correct: 3,
      exp: 'EVMs are standalone sealed machines with no wireless connectivity.',
    },
    {
      q: 'What does the blue button on an EVM control unit indicate?',
      a: ['Power off', 'Ready to vote', 'Vote recorded', 'Technical error'],
      correct: 2,
      exp: 'The blue Ready light indicates the machine is ready for the next voter.',
    },
    {
      q: 'For how many seconds is the VVPAT slip visible?',
      a: ['3 seconds', '5 seconds', '7 seconds', '10 seconds'],
      correct: 2,
      exp: 'The Supreme Court mandated the VVPAT slip to be visible for 7 seconds.',
    },
    {
      q: 'What is the penalty for accepting money to vote?',
      a: ['Fine only', 'Warning only', 'Up to 1 year jail', 'Disqualification'],
      correct: 2,
      exp: 'IPC Section 171B makes electoral bribery punishable with up to one year imprisonment.',
    },
    {
      q: 'What does NOTA stand for?',
      a: [
        'No Other Option',
        'None of the Above',
        'National Option',
        'Neutral Audit',
      ],
      correct: 1,
      exp: 'NOTA allows voters to reject all candidates.',
    },
    {
      q: 'Which app should you use to report MCC violations?',
      a: ['Umang', 'DigiLocker', 'cVIGIL', 'mAadhaar'],
      correct: 2,
      exp: 'cVIGIL resolves election complaints within 100 minutes.',
    },
  ];

  const handleStart = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setStarted(true);
      logQuizStarted(userName);
    }
  };

  const handleAnswer = (idx) => {
    if (feedback) return;
    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) setScore((prev) => prev + 1);
    setFeedback({ isCorrect, exp: questions[currentQ].exp });
  };
  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setFeedback(null);
    } else {
      setFinished(true);
      logQuizCompleted(userName, score); // ✅ score already has the latest value
    }
  };
  if (!started) {
    return (
      <div className="max-w-md mx-auto mt-20 px-6">
        <div className="card text-center space-y-6">
          <h1 className="text-2xl font-bold text-blue-main font-playfair">
            Voter Knowledge Quiz
          </h1>
          <p className="text-muted text-sm">
            Test your knowledge and earn a certified voter badge!
          </p>
          <form onSubmit={handleStart} className="space-y-4">
            <input
              type="text"
              className="input-control text-center text-sm"
              placeholder="Enter your name for the certificate"
              maxLength={50}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full text-sm">
              Start Quiz (10 Questions)
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (finished) {
    const badge =
      score === 10
        ? 'Election Champion'
        : score >= 8
          ? 'Active Citizen'
          : score >= 5
            ? 'Informed Voter'
            : 'Keep Learning';
    return (
      <div className="max-w-xl mx-auto mt-10 px-6 pb-20 text-center animate-fadeIn">
        <div className="card">
          <h2 className="text-2xl font-bold text-blue-main">Quiz Complete!</h2>
          <div className="text-6xl font-black text-saffron my-6">
            {score}/10
          </div>
          <div
            className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
              score === 10
                ? 'bg-saffron text-blue-main'
                : score >= 8
                  ? 'bg-green-main text-white'
                  : 'bg-blue-pale text-blue-main'
            }`}
          >
            🏆 {badge}
          </div>

          <div
            ref={certRef}
            className="as-preview mt-10 p-10 bg-white rounded-radius border-[6px] border-blue-main/10 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-saffron"></div>
            <h3 className="font-playfair text-2xl text-blue-main font-bold">
              CERTIFICATE OF COMPLETION
            </h3>
            <p className="mt-6 text-sm italic text-muted">
              This is to certify that
            </p>
            <div className="my-6">
              <p className="text-4xl font-black text-blue-main font-playfair border-b-2 border-saffron inline-block pb-1 lowercase capitalize">
                {userName}
              </p>
            </div>
            <p className="mt-4 text-sm text-ink max-w-sm mx-auto">
              Has successfully completed the{' '}
              <strong>VoteMitra Election Awareness Quiz</strong>
              with a score of <strong>{score}/10</strong>.
            </p>
            <div className="mt-10 flex justify-between items-end border-t border-blue-pale pt-6">
              <div className="text-left">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                  Date of Achievement
                </p>
                <p className="text-sm font-bold text-blue-main">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-20 h-20 bg-white border-2 border-blue-main flex items-center justify-center p-2 rounded-lg shadow-sm">
                  <span className="material-icons text-4xl text-blue-main">
                    qr_code_2
                  </span>
                </div>
                <p className="text-[8px] font-bold text-blue-main/50 uppercase">
                  Verify Certificate
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <span className="material-icons">download</span> Download PNG
            </button>
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <span className="material-icons">share</span> WhatsApp Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-xl mx-auto mt-10 px-6 pb-20 animate-fadeIn"
    >
      <div className="card" role="region" aria-label="Election Quiz">
        <ProgressBar
          progress={((currentQ + 1) / questions.length) * 100}
          label={`Question ${currentQ + 1} of ${questions.length}`}
        />

        <div className="mt-10 space-y-8">
          <h3
            className="text-xl font-bold text-blue-main min-h-[60px]"
            id="quiz-question"
          >
            {q.q}
          </h3>

          <div
            className="grid grid-cols-1 gap-3"
            role="radiogroup"
            aria-labelledby="quiz-question"
          >
            {q.a.map((ans, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={feedback ? i === q.correct : false}
                disabled={!!feedback}
                className={`p-4 text-left border-[1.5px] rounded-radius-sm transition-all focus:ring-2 focus:ring-blue-main focus:outline-none ${
                  feedback
                    ? i === q.correct
                      ? 'bg-green-main/10 border-green-main'
                      : 'border-border-gray'
                    : 'border-border-gray hover:border-blue-main hover:bg-bg-main'
                } ${feedback && i !== q.correct && 'opacity-50'}`}
                onClick={() => handleAnswer(i)}
              >
                <span className="font-bold mr-3">
                  {String.fromCharCode(65 + i)})
                </span>
                {ans}
              </button>
            ))}
          </div>

          <div aria-live="polite">
            {feedback && (
              <div className="space-y-4 animate-fadeIn">
                <div
                  className={`p-4 rounded-radius-sm text-sm font-medium ${feedback.isCorrect ? 'bg-green-main/10 text-green-main border border-green-main' : 'bg-red-main/10 text-red-main border border-red-main'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-icons text-sm" aria-hidden="true">
                      {feedback.isCorrect ? 'check_circle' : 'cancel'}
                    </span>
                    <strong>
                      {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
                    </strong>
                  </div>
                  {feedback.exp}
                </div>
                <button
                  className="btn-primary w-full py-3 focus:ring-4"
                  onClick={nextQuestion}
                >
                  {currentQ === questions.length - 1
                    ? 'Show Results'
                    : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

Quiz.propTypes = {
  // Quiz page props
};

export default Quiz;
