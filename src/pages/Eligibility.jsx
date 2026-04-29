import { useState } from 'react';
import { logEligibilityChecked } from '../utils/analytics';

/**
 * Interactive Eligibility Checker for Indian Voters.
 * Logic based on ECI guidelines: 18+ age, Indian citizenship, sound mind, not disqualified.
 */
const Eligibility = () => {
    // Form state
    const [dob, setDob] = useState('');
    const [citizen, setCitizen] = useState(null);
    const [mind, setMind] = useState(null);
    const [disq, setDisq] = useState(null);
    const [result, setResult] = useState(null);

    /**
     * Evaluates user input against ECI criteria.
     * @param {Event} e - Form submit event.
     */
    const checkEligibility = (e) => {
        e.preventDefault();
        
        // Calculate Age
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

        let outcome = 'ineligible';

        // Evaluation Logic
        if (age < 18) {
            outcome = 'future';
            setResult({ 
                type: 'amber', 
                title: 'Future Voter!', 
                msg: `You will be eligible to vote on ${new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)).toLocaleDateString()}. Mark that date!` 
            });
        } else if (citizen === 'no') {
            setResult({ 
                type: 'red', 
                title: 'Not Eligible', 
                msg: 'Only Indian citizens can vote in Indian elections. NRIs with Indian citizenship can register as overseas voters.' 
            });
        } else if (mind === 'yes' || disq === 'yes') {
            setResult({ 
                type: 'red', 
                title: 'Action Required', 
                msg: 'Based on your answers you may not be currently eligible. Please contact your Electoral Registration Officer or call 1950 for guidance.' 
            });
        } else {
            outcome = 'eligible';
            setResult({ 
                type: 'green', 
                title: 'You are Eligible! ✓', 
                msg: 'Your next steps: 1. Check if your name is on the roll at voters.eci.gov.in. 2. If not, register using Form 6.' 
            });
        }

        // Log for analytics insight
        logEligibilityChecked(outcome);
    };

    // Configuration for the radio group questions
    const questions = [
        { label: "Are you an Indian Citizen?", state: citizen, set: setCitizen },
        { label: "Have you been declared of unsound mind by a court?", state: mind, set: setMind },
        { label: "Have you been disqualified by a court or ECI?", state: disq, set: setDisq }
    ];

    return (
        <main id="main-content" className="max-w-xl mx-auto py-10 px-6 pb-20 animate-fadeIn">
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-3xl font-bold text-blue-main font-playfair">Eligibility Checker</h1>
                <p className="text-muted">Find out if you are legally qualified to vote in India.</p>
            </div>
            
            <div className="card shadow-xl border-t-4 border-blue-main">
                <form onSubmit={checkEligibility} className="space-y-8">
                    {/* DOB Input */}
                    <div className="space-y-2">
                        <label htmlFor="dob-input" className="text-xs font-bold uppercase tracking-widest text-blue-main/60">
                            Date of Birth
                        </label>
                        <input 
                            id="dob-input" 
                            type="date" 
                            className="input-control focus:ring-2 focus:ring-blue-main" 
                            required 
                            value={dob} 
                            onChange={(e) => setDob(e.target.value)} 
                            aria-required="true"
                        />
                    </div>

                    {/* Question Groups */}
                    {questions.map((q, i) => (
                        <div key={i} className="space-y-3" role="radiogroup" aria-labelledby={`q-title-${i}`}>
                            <h3 id={`q-title-${i}`} className="text-xs font-bold uppercase tracking-widest text-blue-main/60">
                                {q.label}
                            </h3>
                            <div className="flex gap-3">
                                {['yes', 'no'].map(opt => (
                                    <button
                                        key={opt}
                                        type="button"
                                        role="radio"
                                        aria-checked={q.state === opt}
                                        aria-label={`${opt} for ${q.label}`}
                                        className={`flex-1 py-3 px-4 rounded-radius-sm border-[1.5px] font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-main ${
                                            q.state === opt 
                                            ? 'bg-blue-main text-white border-blue-main shadow-md' 
                                            : 'bg-white text-ink border-border-gray hover:border-blue-main hover:bg-bg-main'
                                        }`}
                                        onClick={() => q.set(opt)}
                                    >
                                        <span className="capitalize">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button 
                        type="submit" 
                        className="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl transition-shadow focus:ring-4 active:scale-95"
                    >
                        Check My Eligibility
                    </button>
                </form>

                {/* Result Section */}
                <div aria-live="polite" className="mt-8">
                    {result && (
                        <div className={`p-6 rounded-radius animate-scaleIn border-2 shadow-inner ${
                            result.type === 'green' ? 'bg-green-main/10 border-green-main text-ink' :
                            result.type === 'red' ? 'bg-red-main/10 border-red-main text-ink' : 'bg-amber-main/10 border-amber-main text-ink'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`material-icons ${
                                    result.type === 'green' ? 'text-green-main' : result.type === 'red' ? 'text-red-main' : 'text-amber-main'
                                }`}>
                                    {result.type === 'green' ? 'check_circle' : result.type === 'red' ? 'error' : 'info'}
                                </span>
                                <h4 className="font-bold text-lg">{result.title}</h4>
                            </div>
                            <p className="text-sm leading-relaxed mb-4">{result.msg}</p>
                            {result.type === 'green' && (
                                <button 
                                    className="text-xs font-bold text-blue-main underline hover:opacity-80 focus:outline-none" 
                                    onClick={() => window.open('https://voters.eci.gov.in', '_blank')}
                                    aria-label="Register on ECI Voter Portal"
                                >
                                    Go to ECI Voter Portal →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Eligibility;
