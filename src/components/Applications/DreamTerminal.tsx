import React, { useState, useEffect, useRef } from 'react';
import { useDreamContext } from '../../context/DreamContext';
import { geminiService } from '../../services/geminiService';

const DreamTerminal: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { dreams, analyzeDream, completeDream } = useDreamContext();

  useEffect(() => {
    setOutput([
      'DreamLog 98 Terminal v1.0',
      'Type "help" for available commands',
      'Ready to explore your subconscious...',
      ''
    ]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = async (command: string) => {
    const cmd = command.trim().toLowerCase();
    const args = cmd.split(' ');
    
    setOutput(prev => [...prev, `> ${command}`]);
    
    switch (args[0]) {
      case 'help':
        setOutput(prev => [...prev, 
          'Available commands:',
          '  help - Show this help message',
          '  ls - List dream entries',
          '  analyze [title] - Analyze a dream by title',
          '  complete [title] - Continue a dream with AI',
          '  detect [type] [title] - Detect emotions/symbols/characters',
          '  summarize - Summarize recent dreams',
          '  symbols - Show recurring symbols',
          '  emotions - Show emotional patterns',
          '  clear - Clear terminal',
          '  wake - Exit dream state',
          ''
        ]);
        break;
        
      case 'ls':
        if (dreams.length === 0) {
          setOutput(prev => [...prev, 'No dreams found. Start journaling to see entries.', '']);
        } else {
          setOutput(prev => [...prev, 'Dream entries:']);
          dreams.forEach((dream, index) => {
            const date = new Date(dream.date).toLocaleDateString();
            setOutput(prev => [...prev, `  ${index + 1}. ${dream.title} (${date})`]);
          });
          setOutput(prev => [...prev, '']);
        }
        break;
        
      case 'analyze':
        if (args.length < 2) {
          setOutput(prev => [...prev, 'Usage: analyze [dream_title]', '']);
        } else {
          const title = args.slice(1).join(' ');
          const dream = dreams.find(d => d.title.toLowerCase().includes(title));
          
          if (!dream) {
            setOutput(prev => [...prev, `Dream "${title}" not found.`, '']);
          } else {
            setOutput(prev => [...prev, `Analyzing dream: "${dream.title}"...`]);
            try {
              const analysis = await analyzeDream(dream.content);
              setOutput(prev => [...prev, analysis, '']);
            } catch (error) {
              setOutput(prev => [...prev, 'Analysis failed. The dream realm is unreachable.', '']);
            }
          }
        }
        break;
        
      case 'complete':
        if (args.length < 2) {
          setOutput(prev => [...prev, 'Usage: complete [dream_title]', '']);
        } else {
          const title = args.slice(1).join(' ');
          const dream = dreams.find(d => d.title.toLowerCase().includes(title));
          
          if (!dream) {
            setOutput(prev => [...prev, `Dream "${title}" not found.`, '']);
          } else {
            setOutput(prev => [...prev, `Completing dream: "${dream.title}"...`]);
            try {
              const completion = await completeDream(dream.content);
              setOutput(prev => [...prev, `Dream continuation:`, completion, '']);
            } catch (error) {
              setOutput(prev => [...prev, 'Dream completion failed. The muse is silent.', '']);
            }
          }
        }
        break;
        
      case 'detect':
        if (args.length < 2) {
          setOutput(prev => [...prev, 'Usage: detect [emotions|symbols|characters] [dream_title]', '']);
        } else {
          const type = args[1];
          const title = args.slice(2).join(' ');
          const dream = dreams.find(d => d.title.toLowerCase().includes(title));
          
          if (!dream) {
            setOutput(prev => [...prev, `Dream "${title}" not found.`, '']);
          } else {
            setOutput(prev => [...prev, `Detecting ${type} in "${dream.title}"...`]);
            try {
              let result: string[] = [];
              switch (type) {
                case 'emotions':
                  result = await geminiService.detectEmotions(dream.content);
                  break;
                case 'symbols':
                  result = await geminiService.detectSymbols(dream.content);
                  break;
                case 'characters':
                  result = await geminiService.generateDreamCharacters(dream.content);
                  break;
                default:
                  setOutput(prev => [...prev, 'Invalid detection type. Use: emotions, symbols, or characters', '']);
                  return;
              }
              setOutput(prev => [...prev, `${type.charAt(0).toUpperCase() + type.slice(1)} detected:`, result.join(', '), '']);
            } catch (error) {
              setOutput(prev => [...prev, `Detection failed. The ${type} remain hidden.`, '']);
            }
          }
        }
        break;
        
      case 'summarize':
        if (dreams.length === 0) {
          setOutput(prev => [...prev, 'No dreams to summarize.', '']);
        } else {
          setOutput(prev => [...prev, 
            'Dream Summary:',
            `Total dreams logged: ${dreams.length}`,
            `Most recent: ${dreams[dreams.length - 1]?.title || 'N/A'}`,
            'Common themes: transformation, flying, water, mirrors',
            ''
          ]);
        }
        break;
        
      case 'symbols':
        if (dreams.length === 0) {
          setOutput(prev => [...prev, 'No dreams to analyze for symbols.', '']);
        } else {
          // Aggregate symbols from all dreams
          const allSymbols = dreams.flatMap(d => d.symbols);
          const symbolCounts = allSymbols.reduce((acc, symbol) => {
            acc[symbol] = (acc[symbol] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const sortedSymbols = Object.entries(symbolCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
          
          setOutput(prev => [...prev, 'Recurring symbols detected:']);
          sortedSymbols.forEach(([symbol, count]) => {
            const percentage = Math.round((count / dreams.length) * 100);
            setOutput(prev => [...prev, `  ${symbol} - appears in ${percentage}% of dreams`]);
          });
          setOutput(prev => [...prev, '']);
        }
        break;
        
      case 'emotions':
        if (dreams.length === 0) {
          setOutput(prev => [...prev, 'No dreams to analyze for emotions.', '']);
        } else {
          // Aggregate emotions from all dreams
          const allEmotions = dreams.flatMap(d => d.emotions);
          const emotionCounts = allEmotions.reduce((acc, emotion) => {
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const sortedEmotions = Object.entries(emotionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
          
          setOutput(prev => [...prev, 'Emotional patterns:']);
          sortedEmotions.forEach(([emotion, count]) => {
            const percentage = Math.round((count / dreams.length) * 100);
            const bars = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));
            setOutput(prev => [...prev, `  ${emotion}: ${bars} ${percentage}%`]);
          });
          setOutput(prev => [...prev, '']);
        }
        break;
        
      case 'clear':
        setOutput(['']);
        break;
        
      case 'wake':
        setOutput(prev => [...prev, 'Exiting dream state...']);
        setTimeout(() => {
          setOutput(prev => [...prev, 'Connection to dream realm closed.', '']);
        }, 1000);
        break;
        
      default:
        setOutput(prev => [...prev, `Command not found: ${command}`, 'Type "help" for available commands.', '']);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        setCommandHistory(prev => [...prev, currentCommand]);
        setHistoryIndex(-1);
        executeCommand(currentCommand);
        setCurrentCommand('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono">
      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed"
      >
        {output.map((line, index) => (
          <div key={index} className={line.startsWith('>') ? 'text-yellow-400' : ''}>
            {line}
          </div>
        ))}
        
        {/* Command Prompt */}
        <div className="flex items-center">
          <span className="text-cyan-400 mr-2">dreamlog@subconscious:~$</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default DreamTerminal;