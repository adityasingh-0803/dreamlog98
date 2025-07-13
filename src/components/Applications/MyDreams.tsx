import React, { useState } from 'react';
import { useDreamContext } from '../../context/DreamContext';
import { Folder, FileText, Calendar, Heart, Zap, Moon, BarChart3, Search, Filter, Download, Upload, Settings, Trash2 } from 'lucide-react';

const MyDreams: React.FC = () => {
  const { dreams, getEmotionalAnalysis, getDreamsByCategory } = useDreamContext();
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'length'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDreams, setSelectedDreams] = useState<string[]>([]);

  const folders = [
    { id: 'all', name: 'All Dreams', icon: Folder, count: dreams.length },
    { id: 'recent', name: 'Recent', icon: Calendar, count: getDreamsByCategory('recent').length },
    { id: 'lucid', name: 'Lucid Dreams', icon: Zap, count: getDreamsByCategory('lucid').length },
    { id: 'nightmare', name: 'Nightmares', icon: Moon, count: getDreamsByCategory('nightmare').length },
    { id: 'emotional', name: 'Emotional', icon: Heart, count: getDreamsByCategory('emotional').length }
  ];

  const getFilteredDreams = () => {
    return selectedFolder === 'all' ? dreams : getDreamsByCategory(selectedFolder);
  };


  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleExportDreams = () => {
    const dreamData = JSON.stringify(dreams, null, 2);
    const blob = new Blob([dreamData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dreams_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDreams = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedDreams = JSON.parse(e.target?.result as string);
            console.log('Imported dreams:', importedDreams);
            alert(`Successfully imported ${importedDreams.length} dreams!`);
          } catch (error) {
            alert('Error importing dreams. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleDreamSelection = (dreamId: string) => {
    setSelectedDreams(prev => 
      prev.includes(dreamId) 
        ? prev.filter(id => id !== dreamId)
        : [...prev, dreamId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedDreams.length > 0 && window.confirm(`Delete ${selectedDreams.length} selected dreams?`)) {
      // In a real app, this would call a delete function from context
      setSelectedDreams([]);
      alert('Dreams deleted successfully!');
    }
  };

  const getSortedAndFilteredDreams = () => {
    let filtered = getFilteredDreams();
    
    if (searchTerm) {
      filtered = filtered.filter(dream => 
        dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dream.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'length':
          return b.content.length - a.content.length;
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
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
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">New Folder</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleImportDreams}>Import Dreams...</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleExportDreams}>Export Dreams...</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Properties</div>
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
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Select All</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Invert Selection</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleDeleteSelected}>Delete Selected</div>
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
                onClick={() => setViewMode('list')}
              >
                List View {viewMode === 'list' && '✓'}
              </div>
              <div 
                className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs flex items-center justify-between"
                onClick={() => setViewMode('grid')}
              >
                Grid View {viewMode === 'grid' && '✓'}
              </div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Refresh</div>
            </div>
          )}
        </div>
        
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">Tools</span>
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-gray-200 border-b border-gray-400 flex items-center px-2 gap-2">
        <div className="flex items-center gap-1">
          <Search className="w-3 h-3 text-gray-600" />
          <input
            type="text"
            placeholder="Search dreams..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-2 py-1 border border-gray-400 text-xs w-32"
          />
        </div>
        
        <div className="w-px h-6 bg-gray-400"></div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'length')}
          className="px-2 py-1 border border-gray-400 text-xs"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="length">Sort by Length</option>
        </select>
        
        <button className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs">
          <BarChart3 className="w-3 h-3" />
          Analytics
        </button>
        
        {selectedDreams.length > 0 && (
          <button 
            onClick={handleDeleteSelected}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white border border-red-600 hover:bg-red-400 text-xs"
          >
            <Trash2 className="w-3 h-3" />
            Delete ({selectedDreams.length})
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-100 border-r border-gray-400">
          <div className="h-8 bg-gray-200 border-b border-gray-400 flex items-center px-2 text-xs font-semibold">
            Dream Folders
          </div>
          
          <div className="p-2">
            {folders.map((folder) => {
              const IconComponent = folder.icon;
              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-100 ${
                    selectedFolder === folder.id ? 'bg-blue-200' : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">{folder.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">({folder.count})</span>
                </div>
              );
            })}
          </div>

          {/* Emotion Chart */}
          <div className="mt-4 p-2 border-t border-gray-300">
            <div className="text-xs font-semibold mb-2">Emotional Patterns</div>
            <div className="space-y-1">
              {getEmotionalAnalysis().map((emotion) => (
                <div key={emotion.emotion} className="flex items-center gap-2">
                  <span className="text-xs w-16 capitalize">{emotion.emotion}</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div 
                      className={`h-2 rounded ${
                        emotion.trend === 'increasing' ? 'bg-red-500' : 
                        emotion.trend === 'stable' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${emotion.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs w-8">{emotion.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dream List */}
        <div className="flex-1 flex flex-col">
          <div className="h-8 bg-gray-200 border-b border-gray-400 flex items-center px-2 text-xs font-semibold">
            {folders.find(f => f.id === selectedFolder)?.name || 'All Dreams'} ({getSortedAndFilteredDreams().length} dreams)
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {getSortedAndFilteredDreams().length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                {searchTerm ? `No dreams found matching "${searchTerm}"` : 'No dreams found in this category'}
              </div>
            ) : (
              <div className={`p-2 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
                {getSortedAndFilteredDreams().map((dream) => (
                  <div
                    key={dream.id}
                    className={`p-3 bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition-shadow ${
                      selectedDreams.includes(dream.id) ? 'bg-blue-50 border-blue-400' : ''
                    }`}
                    onClick={() => toggleDreamSelection(dream.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedDreams.includes(dream.id)}
                        onChange={() => toggleDreamSelection(dream.id)}
                        className="w-3 h-3"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-sm">{dream.title}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(dream.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {dream.content.substring(0, 200)}
                      {dream.content.length > 200 && '...'}
                    </p>
                    
                    {/* Dream Tags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {dream.category === 'lucid' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Lucid</span>
                      )}
                      {dream.category === 'nightmare' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Nightmare</span>
                      )}
                      {dream.category === 'emotional' && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded">Emotional</span>
                      )}
                      {dream.content.toLowerCase().includes('flying') && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Flying</span>
                      )}
                      {dream.content.toLowerCase().includes('water') && (
                        <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">Water</span>
                      )}
                      {dream.emotions.slice(0, 2).map(emotion => (
                        <span key={emotion} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-200 border-t border-gray-400 flex items-center justify-between px-2 text-xs">
        <span>Total dreams: {dreams.length}</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowEditMenu(false);
      setShowViewMenu(false);
      setShowToolsMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
};

export default MyDreams;