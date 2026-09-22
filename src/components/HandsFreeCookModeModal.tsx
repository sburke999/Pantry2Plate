import React, { useState, useEffect, useRef } from 'react';
import { Recipe, CookingStep } from '../data/recipes';
import { soundFx } from '../utils/audio';

interface HandsFreeCookModeModalProps {
  recipe: Recipe;
  initialStepIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStepChange: (stepIndex: number) => void;
}

export const HandsFreeCookModeModal: React.FC<HandsFreeCookModeModalProps> = ({
  recipe,
  initialStepIndex,
  isOpen,
  onClose,
  onStepChange,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string>('');
  
  // Timer state for current step
  const [timerRemaining, setTimerRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const step: CookingStep = recipe.steps[currentStepIndex] || recipe.steps[0];

  // Sync step changes from props
  useEffect(() => {
    setCurrentStepIndex(initialStepIndex);
  }, [initialStepIndex]);

  // Setup timer when step changes
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);

    if (step.timerSeconds) {
      setTimerDuration(step.timerSeconds);
      setTimerRemaining(step.timerSeconds);
    } else {
      setTimerDuration(0);
      setTimerRemaining(0);
    }

    // Auto read step when opening or moving to new step if voice assistant is active
    if (isOpen && isVoiceActive) {
      speakCurrentStep();
    }
  }, [currentStepIndex, isOpen]);

  // Timer interval handling
  useEffect(() => {
    if (timerActive && timerRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            soundFx.playTimerChime();
            soundFx.speakText(`Timer finished for ${step.title}!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timerRemaining, step.title]);

  // Web Speech Recognition for hands-free voice commands
  useEffect(() => {
    if (!isOpen || !isVoiceActive) return;

    type SpeechRecognitionType = {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: (event: any) => void;
      onerror: (event: any) => void;
      onend: () => void;
      start: () => void;
      stop: () => void;
    };

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) return;

    let recognition: SpeechRecognitionType | null = null;
    let isStopped = false;

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.toLowerCase().trim();
        setLastVoiceCommand(transcript);

        if (transcript.includes('next') || transcript.includes('forward')) {
          handleNext();
        } else if (transcript.includes('back') || transcript.includes('previous')) {
          handlePrev();
        } else if (transcript.includes('start timer') || transcript.includes('play timer') || transcript.includes('start')) {
          setTimerActive(true);
          soundFx.playTactileClick();
        } else if (transcript.includes('stop timer') || transcript.includes('pause')) {
          setTimerActive(false);
          soundFx.playTactileClick();
        } else if (transcript.includes('repeat') || transcript.includes('read')) {
          speakCurrentStep();
        } else if (transcript.includes('done') || transcript.includes('finish') || transcript.includes('exit')) {
          onClose();
        }
      };

      rec.onerror = () => {
        // Voice recognition transient error recovery
      };

      rec.onend = () => {
        if (!isStopped && isOpen && isVoiceActive) {
          try {
            rec.start();
          } catch {
            // ignore
          }
        }
      };

      rec.start();
      recognition = rec;
    } catch {
      // Speech recognition not permitted or unsupported
    }

    return () => {
      isStopped = true;
      if (recognition) {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      }
      soundFx.stopSpeaking();
    };
  }, [isOpen, isVoiceActive, currentStepIndex]);

  const speakCurrentStep = () => {
    setIsSpeaking(true);
    const text = `Step ${currentStepIndex + 1}: ${step.title}. ${step.description}`;
    soundFx.speakText(text, () => setIsSpeaking(false));
  };

  const handleNext = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      soundFx.playTactileClick();
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange(nextIndex);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      soundFx.playTactileClick();
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange(prevIndex);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  const progressPercent = ((currentStepIndex + 1) / recipe.steps.length) * 100;
  const timerPercentage =
    timerDuration > 0 ? ((timerDuration - timerRemaining) / timerDuration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1c18] text-[#fcf9f3] flex flex-col justify-between animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Top Header */}
      <div className="pt-safe px-4 py-3 bg-[#31312d]/80 border-b border-[#55433e]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.stopSpeaking();
              onClose();
            }}
            className="w-12 h-12 rounded-xl bg-[#55433e]/40 flex items-center justify-center text-[#fcf9f3] hover:bg-[#55433e] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffbaaa]">
              Hands-Free Cook Mode
            </span>
            <p className="font-serif text-[15px] font-medium text-[#fcf9f3] truncate max-w-[200px] sm:max-w-xs">
              {recipe.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Command Activity Indicator */}
          <button
            onClick={() => {
              setIsVoiceActive(!isVoiceActive);
              if (isSpeaking) {
                soundFx.stopSpeaking();
                setIsSpeaking(false);
              }
            }}
            className={`h-11 px-3 rounded-xl flex items-center gap-2 transition-all font-semibold text-xs ${
              isVoiceActive
                ? 'bg-[#506354] text-[#ffffff] ring-2 ring-[#d0e5d2]/40'
                : 'bg-[#55433e]/50 text-[#dbc1bb]'
            }`}
          >
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-current rounded-full animate-bounce"></span>
              <span className="w-1 h-5 bg-current rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1 h-2.5 bg-current rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </div>
            <span className="hidden sm:inline">
              {isVoiceActive ? 'Voice Listening' : 'Voice Muted'}
            </span>
            <span className="material-symbols-outlined text-[18px]">
              {isVoiceActive ? 'mic' : 'mic_off'}
            </span>
          </button>

          {/* Read Aloud Button */}
          <button
            onClick={speakCurrentStep}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isSpeaking
                ? 'bg-[#8c3d2b] text-[#ffffff] animate-pulse'
                : 'bg-[#55433e]/40 text-[#fcf9f3] hover:bg-[#55433e]'
            }`}
            title="Read step aloud"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSpeaking ? 'volume_up' : 'campaign'}
            </span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#31312d]">
        <div
          className="h-full bg-[#8c3d2b] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Main Center Focus Area - Massive legibility for kitchen */}
      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-2xl mx-auto w-full flex flex-col justify-center gap-6">
        {/* Step Badge & Title */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="inline-flex items-center justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-[#8c3d2b] text-[#ffffff] font-bold text-xs uppercase tracking-wider">
              Step {currentStepIndex + 1} of {recipe.steps.length}
            </span>
            <span className="text-[#dbc1bb] text-xs font-medium">
              {step.subtext}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#fcf9f3] tracking-tight leading-snug">
            {step.title}
          </h2>
        </div>

        {/* Step Large Instructional Text */}
        <div className="p-5 rounded-2xl bg-[#31312d]/90 border border-[#55433e]/60 shadow-xl">
          <p className="font-sans text-lg sm:text-xl text-[#f3f0ea] leading-relaxed font-normal">
            {step.description}
          </p>
        </div>

        {/* Step Photo (if available) */}
        {step.image && (
          <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative border border-[#55433e]/40 shadow-md">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c18]/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-4 text-xs font-semibold text-[#ffdad2]">
              Visual Reference • Skillet Heat
            </div>
          </div>
        )}

        {/* Interactive Step Timer (if this step has a timer) */}
        {step.timerSeconds && (
          <div className="p-4 rounded-2xl bg-[#31312d] border border-[#ffbaaa]/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="#55433e"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="#8c3d2b"
                    strokeWidth="4"
                    strokeDasharray={150.8}
                    strokeDashoffset={150.8 - (150.8 * timerPercentage) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300"
                  />
                </svg>
                <span className="material-symbols-outlined text-[20px] text-[#ffbaaa] absolute">
                  hourglass_top
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#dbc1bb] font-bold block">
                  {step.timerLabel || 'Cooking Timer'}
                </span>
                <span className="font-serif text-3xl font-bold text-[#fcf9f3] tracking-widest tabular-nums">
                  {timerRemaining > 0 ? formatTime(timerRemaining) : '00:00 - Done!'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playTactileClick();
                  setTimerActive(!timerActive);
                }}
                className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                  timerActive
                    ? 'bg-[#7c490e] text-[#ffbd7e]'
                    : 'bg-[#8c3d2b] text-[#ffffff] hover:bg-[#6e2717]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {timerActive ? 'pause' : 'play_arrow'}
                </span>
                <span>{timerActive ? 'Pause' : 'Start'}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playTactileClick();
                  setTimerActive(false);
                  setTimerRemaining(step.timerSeconds || 0);
                }}
                className="w-12 h-12 rounded-xl bg-[#55433e]/50 text-[#fcf9f3] hover:bg-[#55433e] flex items-center justify-center"
                title="Reset timer"
              >
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </button>
            </div>
          </div>
        )}

        {/* Voice Prompts Tip Bar */}
        {isVoiceActive && (
          <div className="py-2 px-3 rounded-xl bg-[#55433e]/30 border border-[#55433e]/40 flex items-center justify-between text-xs text-[#dbc1bb]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#d0e5d2]">tips_and_updates</span>
              <span>Say: <strong>"Next"</strong>, <strong>"Back"</strong>, <strong>"Start Timer"</strong></span>
            </span>
            {lastVoiceCommand && (
              <span className="text-[#ffbaaa] truncate italic max-w-[140px]">
                Heard: "{lastVoiceCommand}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pb-safe p-4 bg-[#31312d]/90 border-t border-[#55433e]/60">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Previous Step */}
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`h-14 px-5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentStepIndex === 0
                ? 'bg-[#55433e]/20 text-[#55433e] cursor-not-allowed'
                : 'bg-[#55433e]/70 text-[#fcf9f3] hover:bg-[#55433e] active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">chevron_left</span>
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Center Info / Done */}
          {currentStepIndex === recipe.steps.length - 1 ? (
            <button
              onClick={() => {
                soundFx.playTimerChime();
                onClose();
              }}
              className="flex-1 h-14 rounded-xl bg-[#506354] text-[#ffffff] font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:bg-[#394b3d] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
              <span>Complete Cooking!</span>
            </button>
          ) : (
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-[#dbc1bb] font-semibold block">
                Up Next
              </span>
              <p className="font-serif text-sm font-semibold text-[#ffbaaa] truncate max-w-[180px] sm:max-w-xs">
                {recipe.steps[currentStepIndex + 1]?.title}
              </p>
            </div>
          )}

          {/* Next Step */}
          <button
            onClick={handleNext}
            disabled={currentStepIndex === recipe.steps.length - 1}
            className={`h-14 px-6 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentStepIndex === recipe.steps.length - 1
                ? 'bg-[#55433e]/20 text-[#55433e] cursor-not-allowed'
                : 'bg-[#8c3d2b] text-[#ffffff] hover:bg-[#6e2717] active:scale-95 shadow-md'
            }`}
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="material-symbols-outlined text-[24px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
