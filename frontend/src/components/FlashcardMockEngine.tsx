import React, { useState, useEffect } from 'react';
import { sampleFlashcards } from '../data/allData';
import { useProgress } from '../context/ProgressContext';
import { Flashcard, DomainType } from '../types';
import { Dices, Timer, Eye, CheckCircle2, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';

export const FlashcardMockEngine: React.FC = () => {
  const { recordRevision } = useProgress();
  const [cards, setCards] = useState<Flashcard[]>(sampleFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainType | 'all'>('all');

  const currentCard = cards[currentIndex];

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsFlipped(true);
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleDomainFilter = (domain: DomainType | 'all') => {
    setSelectedDomain(domain);
    const filtered = domain === 'all' ? sampleFlashcards : sampleFlashcards.filter(c => c.domain === domain);
    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setTimerSeconds(60);
    setIsTimerRunning(false);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setTimerSeconds(60);
    setIsTimerRunning(false);
  };

  const handleAnswerEval = (rating: 'easy' | 'medium' | 'hard' | 'failed') => {
    if (currentCard) {
      recordRevision(currentCard.topicId, rating);
    }
    handleNextCard();
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimerSeconds(60);
    setIsTimerRunning(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-surface p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">MOCK SIMULATOR</span>
            <span className="text-xs text-slate-400">Card {currentIndex + 1} of {cards.length}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Flashcard Interview Practice
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-500 font-semibold text-xs flex items-center gap-1.5 border border-slate-200"
          >
            <Dices size={14} />
            <span>Shuffle Cards</span>
          </button>
        </div>
      </div>

      {/* Domain Filters - Clean Flex Wrap (No Horizontal Scroll) */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {(['all', 'dsa', 'system-design', 'oops', 'os', 'dbms-sql', 'computer-networks', 'genai-ml'] as const).map(d => (
          <button
            key={d}
            onClick={() => handleDomainFilter(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase shrink-0 transition-all ${
              selectedDomain === d
                ? 'bg-purple-600 text-white'
                : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-900'
            }`}
          >
            {d.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Main Flashcard Container */}
      {currentCard && (
        <div className="space-y-4">
          {/* Timer & Controls Bar */}
          <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-amber-600 animate-spin' : 'text-slate-400'}`} />
              <span className="font-mono font-bold text-slate-900 text-sm">{timerSeconds}s</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-[11px] font-semibold text-purple-600 hover:underline"
              >
                {isTimerRunning ? 'Pause Timer' : 'Start 60s Timer'}
              </button>
            </div>
            <span className="text-slate-400 text-[11px]">Difficulty: <span className="text-purple-700 font-semibold">{currentCard.difficulty}</span></span>
          </div>

          {/* Flashcard Area */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[280px] p-8 rounded-3xl card-surface border border-purple-200 flex flex-col justify-between cursor-pointer group shadow-lg relative overflow-hidden transition-all hover:border-purple-500/60"
          >
            <div className="flex items-center justify-between text-xs text-purple-600 font-bold">
              <span className="uppercase tracking-wider">Question Card</span>
              <span className="text-slate-400 flex items-center gap-1 group-hover:text-slate-900">
                <Eye size={14} /> Click to Flip Card
              </span>
            </div>

            <div className="py-6 space-y-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed">
                {currentCard.question}
              </h3>

              {isFlipped && (
                <div className="pt-4 border-t border-slate-200 animate-fadeIn space-y-3">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Answer Explanation:</span>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {currentCard.answer}
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 text-right">
              {isFlipped ? 'Answer Revealed' : 'Think of your answer before flipping'}
            </div>
          </div>

          {/* Evaluation Action Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
              <button
                onClick={() => handleAnswerEval('easy')}
                className="py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">😎</span>
                <span>Easy (Pura)</span>
              </button>

              <button
                onClick={() => handleAnswerEval('medium')}
                className="py-3 px-2 rounded-2xl bg-blue-50 hover:bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">🙂</span>
                <span>Medium (Aadha)</span>
              </button>

              <button
                onClick={() => handleAnswerEval('hard')}
                className="py-3 px-2 rounded-2xl bg-amber-50 hover:bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">😵</span>
                <span>Hard (Kam)</span>
              </button>

              <button
                onClick={() => handleAnswerEval('failed')}
                className="py-3 px-2 rounded-2xl bg-rose-50 hover:bg-rose-500/20 text-rose-700 border border-rose-200 font-bold text-xs transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">❌</span>
                <span>Failed (Nahi)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
