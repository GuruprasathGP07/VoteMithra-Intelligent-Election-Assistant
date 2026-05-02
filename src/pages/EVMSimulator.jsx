import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { logVoteEvent } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

const EVMSimulator = () => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [showVvpat, setShowVvpat] = useState(false);
  const [vvpatConfirmed, setVvpatConfirmed] = useState(null);
  const [timer, setTimer] = useState(7);
  const resultRef = useRef(null);

  const candidates = [
    { id: 1, name: 'Candidate A', party: 'SUNFLOWER PARTY', color: '#F59E0B' },
    { id: 2, name: 'Candidate B', party: 'RIVER PARTY', color: '#3B82F6' },
    { id: 3, name: 'Candidate C', party: 'MOUNTAIN PARTY', color: '#10B981' },
    { id: 4, name: 'NOTA', party: 'None of the Above', color: '#EF4444' },
  ];

  const handleVote = (candidate) => {
    if (selected) return;
    setSelected(candidate);
    logVoteEvent(candidate.id, i18n.language);

    // Trigger VVPAT after 1s
    setTimeout(() => {
      setShowVvpat(true);
    }, 1000);
  };

  useEffect(() => {
    let interval;
    if (showVvpat && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showVvpat, timer]);

  // Focus management: move focus to result section when verification is complete
  useEffect(() => {
    if (vvpatConfirmed !== null && resultRef.current) {
      resultRef.current.focus();
    }
  }, [vvpatConfirmed]);

  const reset = () => {
    setSelected(null);
    setShowVvpat(false);
    setVvpatConfirmed(null);
    setTimer(7);
  };

  return (
    <main
      data-testid="evm-page"
      id="main-content"
      tabIndex={-1}
      className="max-w-4xl mx-auto py-10 px-6 space-y-10"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-main font-playfair">
          EVM Simulator
        </h1>
        <p className="text-muted">
          Experience EXACTLY what happens inside the voting compartment.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Ballot Unit */}
        <section
          className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-[380px] shadow-2xl border border-white/5"
          aria-labelledby="ballot-title"
        >
          <div className="text-center border-bottom border-white/10 pb-4 mb-6">
            <h3
              id="ballot-title"
              className="text-white text-xs font-mono tracking-widest uppercase"
            >
              Electronic Voting Machine
            </h3>
            <p className="text-green-main text-[10px] font-mono mt-2">
              BALLOT UNIT: SELECT YOUR CANDIDATE
            </p>
          </div>

          <div
            className="space-y-3"
            role="group"
            aria-labelledby="ballot-title"
          >
            {candidates.map((c) => (
              <div
                key={c.id}
                className={`flex items-center gap-4 bg-[#1e293b] border p-3 rounded transition-all ${
                  selected?.id === c.id
                    ? 'border-green-main shadow-[0_0_15px_rgba(22,163,74,0.3)]'
                    : 'border-white/10'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: c.color }}
                  aria-hidden="true"
                />
                <div className="flex-1 text-[13px] text-white font-medium uppercase truncate">
                  {c.name} — {c.party}
                </div>
                <button
                  disabled={!!selected}
                  onClick={() => handleVote(c)}
                  className={`w-8 h-5 bg-[#3b82f6] rounded-sm border border-[#1d4ed8] shadow-inner transition-transform active:scale-90 focus:ring-2 focus:ring-green-main focus:outline-none ${selected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:brightness-110'}`}
                  aria-label={`Vote for ${c.name}`}
                  aria-pressed={selected?.id === c.id}
                />
              </div>
            ))}
          </div>

          <div
            aria-live="polite"
            className="h-8 mt-4 flex items-center justify-center"
          >
            {selected && (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-green-main shadow-[0_0_10px_#4ade80]" />
                <span className="text-green-main font-mono text-xs uppercase tracking-widest">
                  Vote Recorded
                </span>
              </div>
            )}
          </div>
        </section>

        {/* VVPAT Unit */}
        <section
          className="w-full max-w-[380px] space-y-4"
          aria-labelledby="vvpat-title"
        >
          <div className="bg-[#0f172a] border-2 border-[#64748b] rounded-xl p-6 shadow-xl relative overflow-hidden">
            <h3
              id="vvpat-title"
              className="text-white text-center font-mono text-xs mb-4 uppercase tracking-wider"
            >
              VVPAT — Voter Verified Paper Audit Trail
            </h3>

            <div className="h-[180px] bg-black border-2 border-[#334155] rounded relative overflow-hidden flex items-center justify-center">
              {showVvpat && (
                <div
                  className={`w-[120px] bg-white text-black p-4 text-center space-y-2 border border-gray-300 transition-all duration-1000 ease-out font-mono text-[10px] ${timer > 0 ? 'translate-y-0' : 'translate-y-48'}`}
                >
                  <div className="font-bold text-[12px] border-b border-black pb-1 mb-1">
                    VOTED
                  </div>
                  <p className="font-black h-8 flex items-center justify-center uppercase">
                    {selected?.name}
                  </p>
                  <p className="truncate opacity-70 italic">
                    {selected?.party}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 text-center" aria-live="assertive">
              {showVvpat && timer > 0 && (
                <div className="space-y-2">
                  <p className="text-saffron text-sm font-medium">
                    Verify that this matches your selection
                  </p>
                  <p className="text-white/50 text-xs font-mono">
                    Visible for {timer} seconds...
                  </p>
                </div>
              )}

              {timer === 0 && vvpatConfirmed === null && (
                <div className="animate-fadeIn space-y-4">
                  <p className="text-white text-sm">
                    Did the slip match your selection?
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="btn-primary flex-1 bg-green-main hover:bg-green-700 text-white focus:ring-2 focus:ring-offset-2"
                      onClick={() => setVvpatConfirmed(true)}
                    >
                      Yes ✓
                    </button>
                    <button
                      className="btn-primary flex-1 bg-red-main hover:bg-red-700 text-white focus:ring-2 focus:ring-offset-2"
                      onClick={() => setVvpatConfirmed(false)}
                    >
                      No ✗
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {vvpatConfirmed !== null && (
            <div
              ref={resultRef}
              tabIndex="-1"
              className={`p-4 rounded-radius animate-fadeIn border-2 focus:outline-none focus:ring-2 ${
                vvpatConfirmed
                  ? 'bg-green-main/10 border-green-main'
                  : 'bg-red-main/10 border-red-main'
              }`}
            >
              <h4
                className={`font-bold mb-1 ${vvpatConfirmed ? 'text-green-main' : 'text-red-main'}`}
              >
                {vvpatConfirmed
                  ? 'Verification Successful ✓'
                  : 'Mismatch Alert ✗'}
              </h4>
              <p className="text-sm">
                {vvpatConfirmed
                  ? 'Your vote has been accurately recorded in the audit trail.'
                  : 'Inform the Presiding Officer immediately. Do not leave the booth. Call ECI at 1950.'}
              </p>
              <button
                className="mt-3 text-xs underline font-bold hover:text-blue-main focus:ring-2 rounded"
                onClick={reset}
              >
                Test Again
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="card max-w-2xl mx-auto bg-blue-pale border-none text-center">
        <p className="text-sm italic">
          <strong>Did you know?</strong> EVMs have no WiFi, no Bluetooth, no
          internet connection. The Supreme Court of India has repeatedly upheld
          EVM integrity. Over 1 billion votes have been cast on EVMs since 1999.
        </p>
      </div>
    </main>
  );
};

EVMSimulator.propTypes = {
  // EVM simulator props
};

export default EVMSimulator;
