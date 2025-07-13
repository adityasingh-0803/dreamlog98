import React, { useState, useEffect } from 'react';
import { Mail, Send, Trash2, RefreshCw, Reply, Forward, Paperclip, Star } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { useDreamContext } from '../../context/DreamContext';

interface DreamEmail {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
  isFromDream: boolean;
  starred?: boolean;
}

const DreamMail: React.FC = () => {
  const [emails, setEmails] = useState<DreamEmail[]>([]);
  const { dreams } = useDreamContext();
  const [selectedEmail, setSelectedEmail] = useState<DreamEmail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  useEffect(() => {
    // Load initial dream emails
    if (dreams.length > 0) {
      generateDreamEmails();
    }
  }, [dreams.length]);

  const generateDreamEmails = async () => {
    setIsGenerating(true);
    
    try {
      // Generate emails based on recent dreams
      const recentDreams = dreams.slice(-3); // Last 3 dreams
      const dreamEmails: DreamEmail[] = [];
      
      if (recentDreams.length === 0) {
        // Default emails if no dreams exist
        const defaultEmail = await geminiService.generateDreamEmail(['mystery', 'awakening'], 'The Dream Keeper');
        dreamEmails.push({
          id: '1',
          from: 'keeper@dreamrealm.void',
          subject: defaultEmail.subject,
          content: defaultEmail.content,
          date: new Date().toISOString(),
          isRead: false,
          isFromDream: true
        });
      } else {
        // Generate emails from dream characters
        for (let i = 0; i < recentDreams.length; i++) {
          const dream = recentDreams[i];
          const themes = [...dream.symbols, ...dream.emotions].slice(0, 3);
          const character = dream.characters[0] || 'mysterious figure';
          
          const emailData = await geminiService.generateDreamEmail(themes, character);
          
          dreamEmails.push({
            id: (i + 1).toString(),
            from: `${character.replace(/\s+/g, '.')}@dreamrealm.void`,
            subject: emailData.subject,
            content: emailData.content,
            date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
            isRead: false,
            isFromDream: true
          });
        }
      }
      
      setEmails(dreamEmails);
      setIsGenerating(false);
    } catch (error) {
      console.error('Failed to generate dream emails:', error);
      setIsGenerating(false);
    }
  };

  const markAsRead = (email: DreamEmail) => {
    setEmails(prev => prev.map(e => 
      e.id === email.id ? { ...e, isRead: true } : e
    ));
  };

  const deleteEmail = (emailId: string) => {
    setEmails(prev => prev.filter(e => e.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const handleReply = () => {
    if (selectedEmail) {
      setComposeData({
        to: selectedEmail.from,
        subject: `Re: ${selectedEmail.subject}`,
        body: `\n\n--- Original Message ---\nFrom: ${selectedEmail.from}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.content}`
      });
      setIsComposing(true);
    }
  };

  const handleForward = () => {
    if (selectedEmail) {
      setComposeData({
        to: '',
        subject: `Fwd: ${selectedEmail.subject}`,
        body: `\n\n--- Forwarded Message ---\nFrom: ${selectedEmail.from}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.content}`
      });
      setIsComposing(true);
    }
  };

  const handleCompose = () => {
    setComposeData({ to: '', subject: '', body: '' });
    setIsComposing(true);
  };

  const handleSendEmail = () => {
    // Simulate sending email
    alert('Email sent to the dream realm!');
    setIsComposing(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(e => 
      e.id === emailId ? { ...e, starred: !e.starred } : e
    ));
  };

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
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={handleCompose}>New Message</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Import...</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Export...</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Print...</div>
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
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Cut</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Copy</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Paste</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Select All</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Find...</div>
            </div>
          )}
        </div>
        
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">View</span>
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">Tools</span>
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-gray-200 border-b border-gray-400 flex items-center px-2 gap-2">
        <button
          onClick={handleCompose}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs"
        >
          <Mail className="w-3 h-3" />
          Compose
        </button>
        <button
          onClick={generateDreamEmails}
          disabled={isGenerating}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs disabled:opacity-50"
        >
          <RefreshCw className="w-3 h-3" />
          {isGenerating ? 'Receiving...' : 'Check Mail'}
        </button>
        <button 
          onClick={handleReply}
          disabled={!selectedEmail}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs disabled:opacity-50"
        >
          <Reply className="w-3 h-3" />
          Reply
        </button>
        <button 
          onClick={handleForward}
          disabled={!selectedEmail}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs disabled:opacity-50"
        >
          <Forward className="w-3 h-3" />
          Forward
        </button>
        {selectedEmail && (
          <button
            onClick={() => deleteEmail(selectedEmail.id)}
            className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        )}
      </div>

      {/* Main Content */}
      {isComposing ? (
        <div className="flex-1 flex flex-col">
          <div className="h-20 bg-gray-100 border-b border-gray-400 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold w-12">To:</label>
              <input 
                type="text" 
                value={composeData.to}
                onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                className="flex-1 px-2 py-1 border border-gray-400 text-xs"
                placeholder="Enter dream realm address..."
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold w-12">Subject:</label>
              <input 
                type="text" 
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                className="flex-1 px-2 py-1 border border-gray-400 text-xs"
                placeholder="Message from the waking world..."
              />
            </div>
          </div>
          
          <div className="flex-1 p-3">
            <textarea
              value={composeData.body}
              onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
              className="w-full h-full resize-none border border-gray-400 p-2 text-sm font-serif"
              placeholder="Write your message to the dream realm..."
            />
          </div>
          
          <div className="h-10 bg-gray-200 border-t border-gray-400 flex items-center justify-between px-3">
            <div className="flex gap-2">
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white border border-blue-600 hover:bg-blue-400 text-xs"
              >
                <Send className="w-3 h-3" />
                Send
              </button>
              <button
                onClick={() => setIsComposing(false)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 text-xs"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">Attach dream fragments</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex">
        {/* Email List */}
        <div className="w-1/3 border-r border-gray-400 bg-gray-50">
          <div className="h-8 bg-gray-200 border-b border-gray-400 flex items-center px-2 text-xs font-semibold">
            Dream Inbox ({emails.filter(e => !e.isRead).length} unread)
          </div>
          
          <div className="overflow-y-auto h-full">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  markAsRead(email);
                }}
                className={`p-3 border-b border-gray-300 cursor-pointer hover:bg-blue-50 ${
                  selectedEmail?.id === email.id ? 'bg-blue-100' : ''
                } ${!email.isRead ? 'bg-yellow-50' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(email.id);
                    }}
                    className="hover:text-yellow-500"
                  >
                    <Star className={`w-3 h-3 ${email.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                  <Mail className={`w-3 h-3 ${email.isFromDream ? 'text-purple-600' : 'text-gray-600'}`} />
                  <span className={`text-xs ${!email.isRead ? 'font-bold' : ''}`}>
                    {email.from}
                  </span>
                </div>
                <div className={`text-sm ${!email.isRead ? 'font-semibold' : ''} mb-1`}>
                  {email.subject}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(email.date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <>
              <div className="h-16 bg-gray-200 border-b border-gray-400 p-3">
                <div className="font-semibold text-sm mb-1">{selectedEmail.subject}</div>
                <div className="text-xs text-gray-600">
                  From: {selectedEmail.from} | 
                  Date: {new Date(selectedEmail.date).toLocaleString()}
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-white">
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                  {selectedEmail.content}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Receiving messages from the dream realm...</p>
                </div>
              ) : (
                <p>Select an email to view its contents</p>
              )}
            </div>
          )}
        </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="h-6 bg-gray-200 border-t border-gray-400 flex items-center justify-between px-2 text-xs">
        <span>Connected to Dream Realm Mail Server</span>
        <span className="text-purple-600">
          {isGenerating && '🌙 Channeling dream messages...'}
        </span>
      </div>
    </div>
  );
};

export default DreamMail;