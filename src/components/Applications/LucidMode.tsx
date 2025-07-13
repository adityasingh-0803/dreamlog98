import React, { useState, useEffect } from 'react';
import { useDreamContext } from '../../context/DreamContext';
import { Eye, Zap, Clock, Target, Award, BookOpen, Settings } from 'lucide-react';

const LucidMode: React.FC = () => {
  const { dreams, getDreamsByCategory } = useDreamContext();
  const [realityChecks, setRealityChecks] = useState(0);
  const [lucidStreak, setLucidStreak] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showRealityCheck, setShowRealityCheck] = useState(false);

  const lucidDreams = getDreamsByCategory('lucid');
  const lucidPercentage = dreams.length > 0 ? Math.round((lucidDreams.length / dreams.length) * 100) : 0;

  const exercises = [
    {
      title: "Reality Check: Hands",
      description: "Look at your hands. In dreams, they often appear distorted or have extra fingers.",
      instruction: "Count your fingers carefully. Do they look normal?"
    },
    {
      title: "Reality Check: Text",
      description: "Read some text, look away, then read it again. In dreams, text often changes.",
      instruction: "Find some text and read it twice. Does it stay the same?"
    },
    {
      title: "Reality Check: Time",
      description: "Check a clock or watch twice. In dreams, time is often inconsistent.",
      instruction: "Look at a clock, look away, then check again. Is the time logical?"
    },
    {
      title: "Dream Recall Exercise",
      description: "Spend 5 minutes trying to remember your last dream in detail.",
      instruction: "Close your eyes and visualize your most recent dream. Write down what you remember."
    },
    {
      title: "Intention Setting",
      description: "Set a clear intention to become lucid in your next dream.",
      instruction: "Repeat: 'Tonight I will realize I am dreaming' while visualizing becoming lucid."
    }
  ];

  const achievements = [
    { name: "First Lucid Dream", unlocked: lucidDreams.length >= 1, icon: "🌟" },
    { name: "Reality Check Master", unlocked: realityChecks >= 10, icon: "👁️" },
    { name: "Lucid Streak", unlocked: lucidStreak >= 3, icon: "🔥" },
    { name: "Dream Explorer", unlocked: lucidDreams.length >= 5, icon: "🚀" },
    { name: "Consciousness Pioneer", unlocked: lucidPercentage >= 25, icon: "🧠" },
    { name: "Oneironaute", unlocked: lucidDreams.length >= 10, icon: "🌙" }
  ];

  useEffect(() => {
    // Random reality check reminders
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        setShowRealityCheck(true);
        setTimeout(() => setShowRealityCheck(false), 5000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const performRealityCheck = () => {
    setRealityChecks(prev => prev + 1);
    setShowRealityCheck(false);
  };

  const nextExercise = () => {
    setCurrentExercise(prev => (prev + 1) % exercises.length);
  };

  const prevExercise = () => {
    setCurrentExercise(prev => (prev - 1 + exercises.length) % exercises.length);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500 rounded-full animate-pulse"></div>
      </div>

      {/* Reality Check Popup */}
      {showRealityCheck && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold">Reality Check!</h3>
            </div>
            <p className="mb-4">Are you dreaming right now? Check your hands, read some text, or look at a clock!</p>
            <div className="flex gap-2">
              <button
                onClick={performRealityCheck}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                I'm Awake
              </button>
              <button
                onClick={() => setShowRealityCheck(false)}
                className="flex-1 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="h-16 bg-black bg-opacity-30 border-b border-purple-500 flex items-center px-4">
        <Eye className="w-6 h-6 mr-3" />
        <h1 className="text-xl font-bold">Lucid Dream Training Center</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm">
            <span className="text-purple-300">Lucidity Rate:</span>
            <span className="font-bold ml-1">{lucidPercentage}%</span>
          </div>
          <div className="text-sm">
            <span className="text-purple-300">Reality Checks:</span>
            <span className="font-bold ml-1">{realityChecks}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Stats & Achievements */}
        <div className="w-1/3 p-4 border-r border-purple-500">
          <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Lucid Dream Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Lucid Dreams:</span>
                <span className="font-bold text-yellow-400">{lucidDreams.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Lucidity Rate:</span>
                <span className="font-bold text-green-400">{lucidPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="font-bold text-orange-400">{lucidStreak}</span>
              </div>
              <div className="flex justify-between">
                <span>Reality Checks:</span>
                <span className="font-bold text-blue-400">{realityChecks}</span>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </h3>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded ${
                    achievement.unlocked 
                      ? 'bg-green-600 bg-opacity-50' 
                      : 'bg-gray-600 bg-opacity-30'
                  }`}
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <span className={`text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.name}
                  </span>
                  {achievement.unlocked && (
                    <span className="ml-auto text-green-400 text-xs">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Training Exercises */}
        <div className="flex-1 p-4">
          <div className="bg-black bg-opacity-30 rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-6 h-6" />
                Training Exercise {currentExercise + 1} of {exercises.length}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevExercise}
                  className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={nextExercise}
                  className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-sm"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">
                {exercises[currentExercise].title}
              </h4>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {exercises[currentExercise].description}
              </p>
              <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg">
                <h5 className="font-semibold text-purple-300 mb-2">Instructions:</h5>
                <p className="text-white">{exercises[currentExercise].instruction}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={performRealityCheck}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                <Eye className="w-4 h-4" />
                Perform Reality Check
              </button>
              <button
                onClick={() => setShowRealityCheck(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                <Clock className="w-4 h-4" />
                Practice Alert
              </button>
            </div>

            {/* Recent Lucid Dreams */}
            {lucidDreams.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Recent Lucid Dreams
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {lucidDreams.slice(-3).map((dream) => (
                    <div key={dream.id} className="bg-purple-800 bg-opacity-30 p-3 rounded">
                      <div className="font-semibold text-yellow-400">{dream.title}</div>
                      <div className="text-sm text-gray-300">
                        {new Date(dream.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {dream.content.substring(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-black bg-opacity-50 border-t border-purple-500 flex items-center justify-between px-4 text-xs">
        <span>Lucid Dream Training Mode Active</span>
        <span>Next reality check in: {Math.floor(Math.random() * 30)} minutes</span>
      </div>
    </div>
  );
};

export default LucidMode;