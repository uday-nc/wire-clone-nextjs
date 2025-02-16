'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (correct: boolean) => void;
  wireColor: string;
  darkMode?: boolean;
}

const questions = {
  red: {
    question: "What color is the impostor's kill animation?",
    options: ["Blue", "Red", "Green", "Yellow"],
    correct: 1
  },
  blue: {
    question: "What task is performed in Electrical?",
    options: ["Upload Data", "Fix Wiring", "Clean Vent", "Swipe Card"],
    correct: 1
  },
  yellow: {
    question: "What is the maximum number of players in a game?",
    options: ["10", "12", "15", "8"],
    correct: 0
  },
  pink: {
    question: "Which room has the MedBay scan task?",
    options: ["Cafeteria", "Navigation", "MedBay", "Admin"],
    correct: 2
  }
};

export default function QuizModal({ 
  isOpen, 
  onClose, 
  onAnswer, 
  wireColor, 
  darkMode = true 
}: QuizModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const quiz = questions[wireColor as keyof typeof questions];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    if (selectedOption === quiz.correct) {
      onAnswer(true);
    } else {
      toast.error('Wrong answer! Try again.');
      onAnswer(false);
    }
    setSelectedOption(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div 
        className={`
          relative 
          p-8 
          rounded-xl 
          shadow-2xl 
          max-w-md 
          w-full 
          mx-4
          ${darkMode 
            ? 'bg-black text-white border border-gray-800' 
            : 'bg-white text-gray-900 border border-gray-200'
          }
        `}
      >
        <h2 className={`
          text-2xl 
          font-bold 
          mb-6
          ${darkMode ? 'text-white' : 'text-gray-900'}
        `}>
          {quiz.question}
        </h2>
        <div className="space-y-4">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`
                w-full 
                p-4 
                rounded-lg 
                text-left 
                transition-all
                ${darkMode 
                  ? (selectedOption === index 
                      ? 'bg-gray-900 text-white border border-gray-700' 
                      : 'bg-black hover:bg-gray-900 text-gray-300 border border-gray-800')
                  : (selectedOption === index 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800')
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className={`
              px-6 
              py-3 
              rounded-lg 
              transition-colors
              ${darkMode
                ? 'bg-black text-gray-300 hover:bg-gray-900 border border-gray-800'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }
            `}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`
              px-6 
              py-3 
              rounded-lg 
              transition-colors
              ${selectedOption === null
                ? (darkMode
                    ? 'bg-black text-gray-700 cursor-not-allowed border border-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : (darkMode
                    ? 'bg-gray-900 text-white hover:bg-black border border-gray-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600')
              }
            `}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}