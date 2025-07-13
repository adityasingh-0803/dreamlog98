import React, { useState } from 'react';
import { useDreamContext } from '../../context/DreamContext';
import { Trash2, RotateCcw, X, Search, Calendar, FileText } from 'lucide-react';

const ForgottenDreams: React.FC = () => {
  const { deletedDreams, restoreDream, permanentlyDeleteDream } = useDreamContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDreams, setSelectedDreams] = useState<string[]>([]);

  const filteredDreams = deletedDreams.filter(dream =>
    dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dream.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = (dreamId: string) => {
    restoreDream(dreamId);
  };

  const handlePermanentDelete = (dreamId: string) => {
    if (window.confirm('Permanently delete this dream? This action cannot be undone.')) {
      permanentlyDeleteDream(dreamId);
    }
  };

  const handleRestoreSelected = () => {
    selectedDreams.forEach(id => restoreDream(id));
    setSelectedDreams([]);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Permanently delete ${selectedDreams.length} dreams? This action cannot be undone.`)) {
      selectedDreams.forEach(id => permanentlyDeleteDream(id));
      setSelectedDreams([]);
    }
  };

  const toggleDreamSelection = (dreamId: string) => {
    setSelectedDreams(prev =>
      prev.includes(dreamId)
        ? prev.filter(id => id !== dreamId)
        : [...prev, dreamId]
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Title Bar */}
      <div className="h-8 bg-gray-200 border-b border-gray-400 flex items-center px-2 text-xs font-semibold">
        <Trash2 className="w-4 h-4 mr-2" />
        Forgotten Dreams - Recycle Bin
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-gray-200 border-b border-gray-400 flex items-center px-2 gap-2">
        <div className="flex items-center gap-1">
          <Search className="w-3 h-3 text-gray-600" />
          <input
            type="text"
            placeholder="Search forgotten dreams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border border-gray-400 text-xs w-40"
          />
        </div>

        <div className="w-px h-6 bg-gray-400"></div>

        {selectedDreams.length > 0 && (
          <>
            <button
              onClick={handleRestoreSelected}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white border border-green-600 hover:bg-green-400 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Restore ({selectedDreams.length})
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white border border-red-600 hover:bg-red-400 text-xs"
            >
              <X className="w-3 h-3" />
              Delete Forever ({selectedDreams.length})
            </button>
          </>
        )}

        <button
          onClick={() => {
            if (window.confirm('Empty the recycle bin? All forgotten dreams will be permanently deleted.')) {
              deletedDreams.forEach(dream => permanentlyDeleteDream(dream.id));
            }
          }}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 text-xs ml-auto"
          disabled={deletedDreams.length === 0}
        >
          <Trash2 className="w-3 h-3" />
          Empty Recycle Bin
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDreams.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Trash2 className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Forgotten Dreams</h3>
            <p className="text-sm text-center">
              {deletedDreams.length === 0 
                ? "Your dreams are safe. No dreams have been deleted."
                : `No dreams match "${searchTerm}"`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDreams.map((dream) => (
              <div
                key={dream.id}
                className={`p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors ${
                  selectedDreams.includes(dream.id) ? 'bg-blue-50 border-blue-400' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedDreams.includes(dream.id)}
                    onChange={() => toggleDreamSelection(dream.id)}
                    className="w-3 h-3"
                  />
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-sm text-gray-700">{dream.title}</span>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                  {dream.content.substring(0, 150)}
                  {dream.content.length > 150 && '...'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(dream.date).toLocaleDateString()}
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">
                    Deleted
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(dream.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-green-500 text-white border border-green-600 hover:bg-green-400 text-xs rounded"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(dream.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-500 text-white border border-red-600 hover:bg-red-400 text-xs rounded"
                  >
                    <X className="w-3 h-3" />
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-200 border-t border-gray-400 flex items-center justify-between px-2 text-xs">
        <span>{filteredDreams.length} forgotten dreams</span>
        <span>Double-click to restore, or use toolbar actions</span>
      </div>
    </div>
  );
};

export default ForgottenDreams;