import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { simulatorSteps } from '../data/simulatorSteps';
import ProgressBar from '../components/ProgressBar';

const ElectionSimulator = () => {
  const [userName, setUserName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(100);
  const [checklist, setChecklist] = useState({
    epic: false,
    slip: false,
    photo: false,
  });
  const [challengeFeedback, setChallengeFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const [isSigned, setIsSigned] = useState(false);

  // Signature Canvas Logic
  useEffect(() => {
    if (simulatorSteps[step]?.type === 'signature' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let drawing = false;

      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
      };

      const start = (e) => {
        drawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      };
      const move = (e) => {
        if (!drawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        setIsSigned(true);
      };
      const end = () => {
        drawing = false;
      };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      window.addEventListener('mouseup', end);
      canvas.addEventListener('touchstart', start);
      canvas.addEventListener('touchmove', move);
      canvas.addEventListener('touchend', end);

      return () => {
        canvas.removeEventListener('mousedown', start);
        canvas.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', end);
      };
    }
  }, [step, isStarted]);

  const handleStart = (e) => {
    e.preventDefault();
    if (userName.trim()) setIsStarted(true);
  };

  const nextStep = () => {
    if (step < simulatorSteps.length - 1) {
      setStep(step + 1);
      setChallengeFeedback(null);
    } else {
      setIsComplete(true);
    }
  };

  const handleChallenge = (option) => {
    if (option.isCorrect) {
      setChallengeFeedback({ type: 'success', msg: option.feedback });
      setTimeout(nextStep, 1500);
    } else {
      setScore((prev) => prev - 10);
      setChallengeFeedback({ type: 'error', msg: option.feedback });
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-md mx-auto mt-20 px-6">
        <div className="card text-center space-y-6">
          <h2 className="text-2xl font-bold text-blue-main">
            Begin Your Journey
          </h2>
          <p className="text-muted">
            Enter your name to start the election day simulation.
          </p>
          <form onSubmit={handleStart} className="space-y-4">
            <input
              type="text"
              className="input-control text-center"
              placeholder="Your Name"
              maxLength={50}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">
              Begin Simulation
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentData = simulatorSteps[step];

  return (
    <main id="main-content" tabIndex={-1} className="max-w-2xl mx-auto mt-10 px-6 pb-20">
      <div className="card text-center">
        <ProgressBar
          progress={(step / (simulatorSteps.length - 1)) * 100}
          label={`Step ${step + 1} of ${simulatorSteps.length}`}
        />

        <div
          className="mt-8 space-y-6"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Step ${step + 1} of ${simulatorSteps.length}`}
        >
          <h2 className="text-2xl font-bold text-blue-main">
            {currentData.title}
          </h2>

          {currentData.type === 'info' && (
            <div className="space-y-6">
              <div className="w-40 h-28 mx-auto bg-blue-pale rounded-radius border-2 border-border-gray flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-4 bg-saffron" />
                <span className="material-icons text-5xl text-blue-main" aria-hidden="true">
                  {currentData.icon}
                </span>
              </div>
              <p className="text-muted">{currentData.content}</p>
              <button className="btn-primary" onClick={nextStep}>
                I have arrived
              </button>
            </div>
          )}

          {currentData.type === 'checklist' && (
            <div className="space-y-6">
              <p className="text-muted">{currentData.content}</p>
              <div className="text-left space-y-3 max-w-sm mx-auto">
                {currentData.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-bg-main rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-saffron"
                      checked={checklist[item.id]}
                      onChange={() =>
                        setChecklist((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }))
                      }
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
              <button
                className="btn-primary"
                disabled={
                  !checklist.epic || !checklist.slip || !checklist.photo
                }
                onClick={nextStep}
              >
                Proceed
              </button>
            </div>
          )}

          {currentData.type === 'challenge' && (
            <div className="space-y-6">
              <p className="font-bold text-red-main">
                CHALLENGE {currentData.challengeId}
              </p>
              <p className="italic text-muted">{currentData.content}</p>
              <div className="grid grid-cols-1 gap-4">
                {currentData.options.map((opt) => (
                  <button
                    key={opt.id}
                    className={`px-6 py-4 border-2 rounded-radius-sm text-left transition-all ${
                      challengeFeedback?.msg === opt.feedback
                        ? opt.isCorrect
                          ? 'bg-green-main/10 border-green-main text-green-main'
                          : 'bg-red-main/10 border-red-main text-red-main'
                        : 'border-border-gray hover:border-blue-main'
                    }`}
                    onClick={() => handleChallenge(opt)}
                  >
                    <span className="font-bold mr-2">{opt.id})</span>{' '}
                    {opt.label}
                  </button>
                ))}
              </div>
              {challengeFeedback && (
                <div
                  className={`p-4 rounded-radius-sm text-sm font-medium animate-fadeIn ${
                    challengeFeedback.type === 'success'
                      ? 'bg-green-main/10 text-green-main'
                      : 'bg-red-main/10 text-red-main'
                  }`}
                >
                  {challengeFeedback.msg}
                  {challengeFeedback.type === 'error' && (
                    <button
                      className="block mx-auto mt-2 underline"
                      onClick={() => setChallengeFeedback(null)}
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {currentData.type === 'signature' && (
            <div className="space-y-6">
              <p className="text-muted">{currentData.content}</p>
              <div className="inline-block border-2 border-dashed border-border-gray p-2 bg-bg-main">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={120}
                  className="bg-white cursor-crosshair touch-none"
                />
              </div>
              <p className="text-xs text-muted">Sign inside the box</p>
              <button
                className="btn-primary"
                disabled={!isSigned}
                onClick={nextStep}
              >
                Confirm Signature
              </button>
            </div>
          )}

          {currentData.type === 'ink' && (
            <div className="space-y-6 text-center">
              <p className="text-muted">{currentData.content}</p>
              <div className="w-24 h-24 mx-auto relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M 40 100 L 40 40 C 40 30, 60 30, 60 40 L 60 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="30"
                    r="8"
                    className="fill-blue-light animate-pulse"
                  />
                </svg>
              </div>
              <button className="btn-primary" onClick={nextStep}>
                Ink Applied - Proceed
              </button>
            </div>
          )}

          {currentData.type === 'evm' && (
            <div className="space-y-6">
              <p className="text-muted">{currentData.content}</p>
              <div className="bg-[#1e293b] p-6 rounded-radius max-w-[240px] mx-auto space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-[#0f172a] p-3 border border-white/10 rounded"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${i === 1 ? 'bg-saffron' : 'bg-green-main'}`}
                    />
                    <button
                      className="w-6 h-4 bg-blue-500 rounded-sm hover:scale-110 active:scale-95 transition-transform"
                      onClick={nextStep}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentData.type === 'vvpat' && (
            <div className="space-y-6">
              <p className="text-muted">
                A paper slip appears in the VVPAT window...
              </p>
              <div className="w-40 h-32 bg-black border-4 border-gray-600 mx-auto relative overflow-hidden rounded">
                <div className="absolute inset-x-4 bg-white top-2 h-16 flex items-center justify-center text-[10px] font-bold animate-[slideUp_1s_ease-out_forwards]">
                  VOTE SLIP
                  <br />
                  VERIFIED
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold">
                  Does the candidate name match?
                </p>
                <button className="btn-primary" onClick={nextStep}>
                  Yes, it matches
                </button>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="space-y-6 animate-fadeIn">
              <span className="material-icons text-6xl text-green-main animate-bounce" aria-hidden="true">
                check_circle
              </span>
              <h2 className="text-3xl font-bold text-green-main">
                Congratulations {userName}!
              </h2>
              <p className="text-lg">You have successfully cast your vote.</p>
              <div className="text-2xl font-black text-blue-main">
                Score: {score}/100
              </div>
              <button className="btn-primary" onClick={() => navigate('/quiz')}>
                Claim Your Certificate
              </button>
            </div>
          )}
        </div>
      </div>



      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </main>
  );
};

ElectionSimulator.propTypes = {};

export default ElectionSimulator;
