'use client';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 text-white">
        <h2 className="text-2xl font-bold mb-6">How to Play</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Game Objective</h3>
            <p>Connect matching colored wires from left to right to complete the electrical circuit.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Controls</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click and drag wires from the left side</li>
              <li>Drop them onto matching colored endpoints on the right</li>
              <li>Answer the Among Us themed questions correctly to connect wires</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Match the colors exactly</li>
              <li>Some wires will connect straight, others at an angle</li>
              <li>All wires must be connected to complete the task</li>
              <li>Wrong answers will prevent the wire from connecting</li>
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
