import { useState, useEffect, useCallback } from 'react';

export function useAlgorithmTrace(totalSteps: number, autoSpeedMs: number = 1500) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [traceMode, setTraceMode] = useState<'stepper' | 'grid'>('stepper');

  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [totalSteps]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoSpeedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, autoSpeedMs]);

  const handleNext = useCallback(() => {
    setCurrentStepIdx((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handlePrev = useCallback(() => {
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    currentStepIdx,
    setCurrentStepIdx,
    isPlaying,
    setIsPlaying,
    togglePlay,
    traceMode,
    setTraceMode,
    handleNext,
    handlePrev,
    handleReset,
  };
}
