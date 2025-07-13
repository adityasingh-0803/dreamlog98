import React, { useState } from 'react';
import { useDreamContext } from '../../context/DreamContext';
import { Moon, Eye, Heart, Brain, Zap, BookOpen, Target } from 'lucide-react';

const ShadowWork: React.FC = () => {
  const { dreams, getDreamsByCategory } = useDreamContext();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedDream, setSelectedDream] = useState<string>('');

  const nightmares = getDreamsByCategory('nightmare');
  const darkThemes = dreams.filter(d => 
    d.content.toLowerCase().includes('dark') ||
    d.content.toLowerCase().includes('shadow') ||
    d.content.toLowerCase().includes('fear') ||
    d.content.toLowerCase().includes('angry') ||
    d.content.toLowerCase().includes('guilt')
  );

  const shadowPrompts = [
    {
      title: "Confronting the Shadow",
      question: "What aspects of yourself do you try to hide from others?",
      guidance: "The shadow contains parts of ourselves we've rejected. Acknowledging these aspects is the first step to integration."
    },
    {
      title: "Fear as Teacher",
      question: "What is your greatest fear trying to teach you?",
      guidance: "Our fears often point to areas where we need growth. What wisdom might your fear be offering?"
    },
    {
      title: "Anger's Message",
      question: "When you feel angry in dreams, what boundaries are being crossed?",
      guidance: "Anger in dreams often signals violated boundaries or unmet needs. What is your anger protecting?"
    },
    {
      title: "The Rejected Self",
      question: "What qualities do you judge harshly in others?",
      guidance: "What we judge in others often reflects our own rejected shadow aspects. How might you reclaim these qualities?"
    },
    {
      title: "Nightmare Wisdom",
      question: "If your nightmare had a message for you, what would it be?",
      guidance: "Nightmares often carry important messages about unresolved issues or suppressed emotions."
    },
    {
      title: "Integration Practice",
      question: "How can you honor both your light and dark aspects?",
      guidance: "True wholeness comes from accepting all parts of ourselves. How can you integrate your shadow with compassion?"
    }
  ];

  const archetypes = [
    { name: "The Destroyer", description: "Represents necessary endings and transformation", color: "bg-red-900" },
    { name: "The Rebel", description: "Challenges authority and breaks limiting rules", color: "bg-purple-900" },
    { name: "The Victim", description: "Shows where you give away your power", color: "bg-gray-700" },
    { name: "The Critic", description: "Points to perfectionism and self-judgment", color: "bg-orange-900" },
    { name: "The Addict", description: "Reveals compulsive patterns and dependencies", color: "bg-indigo-900" },
    { name: "The Saboteur", description: "Undermines success out of fear", color: "bg-green-900" }
  ];

  const handleSaveReflection = () => {
    if (journalEntry.trim()) {
      // In a real app, this would save to a shadow work journal
      alert('Shadow work reflection saved to your private journal.');
      setJournalEntry('');
    }
  };

  const analyzeDreamShadow = (dream: any) => {
    const content = dream.content.toLowerCase();
    const shadowElements = [];

    if (content.includes('chase') || content.includes('run')) {
      shadowElements.push("Running from something may represent avoiding an aspect of yourself");
    }
    if (content.includes('dark') || content.includes('shadow')) {
      shadowElements.push("Darkness often symbolizes the unconscious or hidden aspects");
    }
    if (content.includes('monster') || content.includes('evil')) {
      shadowElements.push("Monsters may represent rejected parts of your psyche");
    }
    if (content.includes('angry') || content.includes('rage')) {
      shadowElements.push("Anger might indicate suppressed emotions or violated boundaries");
    }
    if (content.includes('guilt') || content.includes('shame')) {
      shadowElements.push("Guilt/shame may point to self-judgment or unintegrated aspects");
    }

    return shadowElements;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated dark background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-red-800 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-800 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gray-800 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="h-16 bg-black bg-opacity-50 border-b border-red-800 flex items-center px-4 relative z-10">
        <Moon className="w-6 h-6 mr-3 text-red-400" />
        <h1 className="text-xl font-bold">Shadow Work - Integrating the Dark</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm">
            <span className="text-red-300">Nightmares:</span>
            <span className="font-bold ml-1">{nightmares.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-red-300">Dark Themes:</span>
            <span className="font-bold ml-1">{darkThemes.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative z-10">
        {/* Left Panel - Shadow Archetypes */}
        <div className="w-1/3 p-4 border-r border-red-800">
          <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-400" />
              Shadow Archetypes
            </h3>
            <div className="space-y-2">
              {archetypes.map((archetype, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${archetype.color} bg-opacity-60 border border-gray-600`}
                >
                  <div className="font-semibold text-red-300">{archetype.name}</div>
                  <div className="text-xs text-gray-300 mt-1">{archetype.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dream Analysis */}
          {nightmares.length > 0 && (
            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Nightmare Analysis
              </h3>
              <select
                value={selectedDream}
                onChange={(e) => setSelectedDream(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm mb-3"
              >
                <option value="">Select a nightmare...</option>
                {nightmares.map((dream) => (
                  <option key={dream.id} value={dream.id}>
                    {dream.title}
                  </option>
                ))}
              </select>
              
              {selectedDream && (
                <div className="space-y-2">
                  {analyzeDreamShadow(nightmares.find(d => d.id === selectedDream)).map((insight, index) => (
                    <div key={index} className="text-xs text-yellow-300 bg-yellow-900 bg-opacity-30 p-2 rounded">
                      {insight}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Shadow Work Exercises */}
        <div className="flex-1 p-4">
          <div className="bg-black bg-opacity-50 rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-6 h-6 text-red-400" />
                Shadow Work Exercise {currentPrompt + 1} of {shadowPrompts.length}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPrompt(prev => (prev - 1 + shadowPrompts.length) % shadowPrompts.length)}
                  className="px-3 py-1 bg-red-800 rounded hover:bg-red-700 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPrompt(prev => (prev + 1) % shadowPrompts.length)}
                  className="px-3 py-1 bg-red-800 rounded hover:bg-red-700 text-sm"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-red-400 mb-3">
                {shadowPrompts[currentPrompt].title}
              </h4>
              <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg mb-4">
                <h5 className="font-semibold text-red-300 mb-2">Reflection Question:</h5>
                <p className="text-white text-lg italic">"{shadowPrompts[currentPrompt].question}"</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-4">
                <h5 className="font-semibold text-gray-300 mb-2">Guidance:</h5>
                <p className="text-gray-300">{shadowPrompts[currentPrompt].guidance}</p>
              </div>
            </div>

            {/* Journal Area */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Private Reflection
              </h4>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your honest reflections here... This is a safe space for exploring your shadow."
                className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded text-white resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveReflection}
                className="flex items-center gap-2 px-4 py-2 bg-purple-700 rounded hover:bg-purple-600"
              >
                <Heart className="w-4 h-4" />
                Save Reflection
              </button>
              <button
                onClick={() => setJournalEntry('')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>

            {/* Shadow Integration Tips */}
            <div className="mt-6 bg-purple-900 bg-opacity-30 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-300 mb-2">Integration Reminder:</h5>
              <p className="text-sm text-gray-300">
                Shadow work is about integration, not elimination. The goal is to acknowledge and accept 
                all parts of yourself with compassion. What you resist persists; what you embrace transforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-black bg-opacity-70 border-t border-red-800 flex items-center justify-between px-4 text-xs relative z-10">
        <span>Shadow Work Session Active - Practice Self-Compassion</span>
        <span className="text-red-400">Remember: Integration, not elimination</span>
      </div>
    </div>
  );
};

export default ShadowWork;