'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '../utils/device';
import Wire from './Wire';
import QuizModal from './QuizModal';
import InstructionsModal from './InstructionsModal';
import { Toaster, toast } from 'react-hot-toast';

const LEFT_COLORS = ['red', 'blue', 'yellow', 'pink'];
const RIGHT_COLORS = ['red', 'blue', 'pink', 'yellow'];

interface WireConnection {
  id: number;
  color: string;
  isConnected: boolean;
  connectedTo: number | null;
}

interface PendingConnection {
  leftId: number;
  rightId: number;
  color: string;
}

export default function WireGame() {
  const [leftWires, setLeftWires] = useState<WireConnection[]>([]);
  const [rightWires, setRightWires] = useState<WireConnection[]>([]);
  const [completed, setCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400, border: 2 });
  const [showGameOver, setShowGameOver] = useState(false);
  const [quizModal, setQuizModal] = useState<{
    isOpen: boolean;
    pendingConnection: PendingConnection | null;
  }>({
    isOpen: false,
    pendingConnection: null,
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    initializeWires();
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);
    applyDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setShowGameOver(true);
      setIsTimerRunning(false);
    }
  }, [timeLeft, isTimerRunning]);

  useEffect(() => {
    if (completed) {
      setIsTimerRunning(false);
      setShowGameOver(true);
    }
  }, [completed]);

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const initializeWires = () => {
    setLeftWires(LEFT_COLORS.map((color, index) => ({
      id: index,
      color,
      isConnected: false,
      connectedTo: null,
    })));
    
    setRightWires(RIGHT_COLORS.map((color, index) => ({
      id: index + LEFT_COLORS.length,
      color,
      isConnected: false,
      connectedTo: null,
    })));
    
    setCompleted(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    applyDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  const handleConnect = (leftId: number, rightId: number) => {
    const leftWire = leftWires.find(w => w.id === leftId);
    const rightWire = rightWires.find(w => w.id === rightId);
    
    if (!leftWire || !rightWire || leftWire.color !== rightWire.color) return;
    
    setQuizModal({
      isOpen: true,
      pendingConnection: { leftId, rightId, color: leftWire.color },
    });
  };

  const handleQuizAnswer = (correct: boolean) => {
    if (!quizModal.pendingConnection || !correct) {
      setQuizModal({ isOpen: false, pendingConnection: null });
      return;
    }

    const { leftId, rightId } = quizModal.pendingConnection;

    setLeftWires(prev => prev.map(wire => 
      wire.id === leftId ? { ...wire, isConnected: true, connectedTo: rightId } :
      wire.connectedTo === rightId ? { ...wire, isConnected: false, connectedTo: null } : wire
    ));

    setRightWires(prev => prev.map(wire => 
      wire.id === rightId ? { ...wire, isConnected: true, connectedTo: leftId } :
      wire.connectedTo === leftId ? { ...wire, isConnected: false, connectedTo: null } : wire
    ));

    setQuizModal({ isOpen: false, pendingConnection: null });
  };

  const handleSubmit = () => {
    const allConnected = leftWires.every(wire => wire.connectedTo !== null);
    if (!allConnected) {
      toast.error('Connect all wires before submitting!');
      return;
    }
    
    const allCorrect = leftWires.every(wire => {
      const connectedWire = rightWires.find(w => w.id === wire.connectedTo);
      return connectedWire && wire.color === connectedWire.color;
    });

    if (allCorrect) {
      setCompleted(true);
      setShowGameOver(true);
      setIsTimerRunning(false);
      toast.success('Great job! All wires connected correctly! 🎉');
    } else {
      toast.error('Some wires are connected incorrectly! Try again.');
    }
  };

  const resetGame = () => {
    setTimeLeft(30);
    setIsTimerRunning(false);
    setCompleted(false);
    setShowGameOver(false);
    setShowInstructions(true);
    initializeWires();
  };

  const handleInstructionsClose = () => {
    setShowInstructions(false);
    setIsTimerRunning(true);
  };

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend} options={{ enableMouseEvents: true }}>
      <main className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#333',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
        <div className="fixed top-0 left-0 right-0 p-2 flex justify-between items-center z-50 bg-inherit transition-colors duration-200">
          <button onClick={() => setShowInstructions(true)} className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200">
            How to Play
          </button>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            Time: {timeLeft}s
          </div>
          <button onClick={toggleDarkMode} className="p-1 rounded bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-900 transition-colors duration-200" style={{ border: '1px solid rgba(128, 128, 128, 0.2)' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen pt-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">Among Us Wire Task</h1>
          <div 
            className="bg-white dark:bg-black rounded-lg transition-colors duration-200"
            style={{ 
              width: `${containerSize.width}px`, 
              height: `${containerSize.height}px`,
              border: '10px solid rgba(128, 128, 128, 0.2)',
            }}
          >
            <div className="h-full flex">
              <div className="w-full px-8 py-6 flex justify-between">
                <div className="space-y-10 py-6">
                  {leftWires.map(wire => (
                    <Wire key={wire.id} wire={wire} position="left" onConnect={handleConnect} wires={{ left: leftWires, right: rightWires }} />
                  ))}
                </div>
                <div className="space-y-10 py-6">
                  {rightWires.map(wire => (
                    <Wire key={wire.id} wire={wire} position="right" onConnect={handleConnect} wires={{ left: leftWires, right: rightWires }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-bold text-lg"
          >
            Submit
          </button>
        </div>

        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black p-8 rounded-lg text-center max-w-md" style={{ border: '2px solid rgba(128, 128, 128, 0.2)' }}>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How to Play</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect matching colored wires from left to right. Drag from one connector to another.
                You have 30 seconds to complete the task!
              </p>
              <button 
                onClick={handleInstructionsClose}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
        <InstructionsModal isOpen={false} onClose={() => setShowInstructions(false)} />
        <QuizModal
          isOpen={quizModal.isOpen}
          onClose={() => setQuizModal({ isOpen: false, pendingConnection: null })}
          onAnswer={handleQuizAnswer}
          wireColor={quizModal.pendingConnection?.color || ''}
          darkMode={darkMode}
        />

        {showGameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black p-8 rounded-lg text-center" style={{ border: '2px solid rgba(128, 128, 128, 0.2)' }}>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {completed ? 'Congratulations! 🎉' : 'Time\'s Up!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {completed ? 'You successfully completed the wire task!' : 'You ran out of time!'}
              </p>
              <button 
                onClick={resetGame}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </main>
    </DndProvider>
  );
}