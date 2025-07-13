import React, { useState, useEffect } from 'react';
import { useDreamContext } from '../../context/DreamContext';
import { Save, Sparkles, Moon, FileText, Edit, Eye, Search, Settings } from 'lucide-react';

const DreamJournal: React.FC = () => {
  const { dreams, addDream, analyzeDream, completeDream, enhanceDreamWithAI } = useDreamContext();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoCompleteActive, setAutoCompleteActive] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showDreamsMenu, setShowDreamsMenu] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(12);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      const newDream = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString(),
        emotions: [],
        symbols: [],
        characters: []
      };
      
      // Enhance dream with AI analysis
      enhanceDreamWithAI(newDream).then((enhancedDream) => {
        addDream(enhancedDream);
      }).catch((error) => {
        console.error('Dream enhancement failed:', error);
        addDream(newDream);
      });
      
      setTitle('');
      setContent('');
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDream(content);
      // Add analysis results to the content
      setContent(prev => `${prev}\n\n--- Dream Analysis ---\n${analysis}`);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoComplete = () => {
    setAutoCompleteActive(true);
    
    completeDream(content).then((completion) => {
      setContent(prev => prev + completion);
      setAutoCompleteActive(false);
    }).catch((error) => {
      console.error('Auto-complete failed:', error);
      setAutoCompleteActive(false);
    });
  };

  const handleNew = () => {
    if (content.trim() || title.trim()) {
      if (window.confirm('Do you want to save changes to your current dream?')) {
        handleSave();
      }
    }
    setTitle('');
    setContent('');
  };

  const handleOpen = () => {
    // Simulate file dialog
    const dreamTitles = dreams.map(d => d.title);
    if (dreamTitles.length === 0) {
      alert('No saved dreams found.');
      return;
    }
    
    const selectedTitle = prompt(`Select a dream to open:\n${dreamTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nEnter the number:`);
    const index = parseInt(selectedTitle || '0') - 1;
    
    if (index >= 0 && index < dreams.length) {
      const dream = dreams[index];
      setTitle(dream.title);
      setContent(dream.content);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Dream: ${title}</title></head>
          <body style="font-family: 'Courier New', monospace; padding: 20px;">
            <h2>${title}</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <hr>
            <pre style="white-space: pre-wrap;">${content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleFind = () => {
    const searchTerm = prompt('Find what:');
    if (searchTerm && content.includes(searchTerm)) {
      // Highlight found text (simplified)
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const index = content.indexOf(searchTerm);
        textarea.focus();
        textarea.setSelectionRange(index, index + searchTerm.length);
      }
    } else if (searchTerm) {
      alert(`Cannot find "${searchTerm}"`);
    }
  };

  const handleSelectAll = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.select();
    }
  };

  const handleTimeDate = () => {
    const now = new Date();
    const timeDate = `${now.toLocaleTimeString()} ${now.toLocaleDateString()}`;
    setContent(prev => prev + timeDate);
  };
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="h-6 bg-gray-200 border-b border-gray-400 flex items-center px-2 text-xs">
        <div className="relative">
          <span 
            className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer"
            onClick={() => setShowFileMenu(!showFileMenu)}
          >
            File
          </span>
          {showFileMenu && (
            <div className="absolute top-full left-0 bg-gray-200 border border-gray-400 shadow-lg z-50 min-w-32">
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleNew}>New</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleOpen}>Open...</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleSave}>Save</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handlePrint}>Print...</div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <span 
            className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer"
            onClick={() => setShowEditMenu(!showEditMenu)}
          >
            Edit
          </span>
          {showEditMenu && (
            <div className="absolute top-full left-0 bg-gray-200 border border-gray-400 shadow-lg z-50 min-w-32">
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={() => document.execCommand('undo')}>Undo</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={() => document.execCommand('cut')}>Cut</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={() => document.execCommand('copy')}>Copy</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={() => document.execCommand('paste')}>Paste</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleFind}>Find...</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleSelectAll}>Select All</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleTimeDate}>Time/Date</div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <span 
            className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer"
            onClick={() => setShowViewMenu(!showViewMenu)}
          >
            View
          </span>
          {showViewMenu && (
            <div className="absolute top-full left-0 bg-gray-200 border border-gray-400 shadow-lg z-50 min-w-32">
              <div 
                className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs flex items-center justify-between"
                onClick={() => setWordWrap(!wordWrap)}
              >
                Word Wrap {wordWrap && '✓'}
              </div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Font...</div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <span 
            className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer"
            onClick={() => setShowDreamsMenu(!showDreamsMenu)}
          >
            Dreams
          </span>
          {showDreamsMenu && (
            <div className="absolute top-full left-0 bg-gray-200 border border-gray-400 shadow-lg z-50 min-w-32">
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleAutoComplete}>AI Complete</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleAnalyze}>Analyze Dream</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Dream Statistics</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Export Dreams</div>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-gray-200 border-b border-gray-400 flex items-center px-2 gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs"
        >
          <Save className="w-3 h-3" />
          Save
        </button>
        <button
          onClick={handleAutoComplete}
          disabled={autoCompleteActive}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3" />
          {autoCompleteActive ? 'Channeling...' : 'AI Complete'}
        </button>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs disabled:opacity-50"
        >
          <Moon className="w-3 h-3" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Title Input */}
      <div className="p-2 border-b border-gray-300">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dream Title..."
          className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500 font-semibold"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your dream... Let the images and emotions flow freely..."
          className={`w-full h-full resize-none border border-gray-400 p-2 focus:outline-none focus:border-blue-500 font-mono leading-relaxed ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}
          style={{ 
            fontFamily: 'Courier New, monospace',
            fontSize: `${fontSize}px`,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-200 border-t border-gray-400 flex items-center justify-between px-2 text-xs">
        <span>Dreams logged: {dreams.length}</span>
        <span>
          {autoCompleteActive && (
            <span className="text-purple-600 animate-pulse">🌙 Channeling dream wisdom...</span>
          )}
          {isAnalyzing && (
            <span className="text-blue-600 animate-pulse">🔮 Analyzing symbols...</span>
          )}
        </span>
      </div>
    </div>
  );

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowEditMenu(false);
      setShowViewMenu(false);
      setShowDreamsMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
};

export default DreamJournal;