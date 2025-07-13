import React, { createContext, useContext, useState, ReactNode } from 'react';
import { geminiService } from '../services/geminiService';

interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  emotions: string[];
  symbols: string[];
  characters: string[];
  category?: 'lucid' | 'nightmare' | 'emotional' | 'normal';
  isDeleted?: boolean;
}

interface DreamContextType {
  dreams: Dream[];
  deletedDreams: Dream[];
  addDream: (dream: Dream) => void;
  removeDream: (id: string) => void;
  restoreDream: (id: string) => void;
  permanentlyDeleteDream: (id: string) => void;
  analyzeDream: (content: string) => Promise<string>;
  completeDream: (dreamText: string) => Promise<string>;
  enhanceDreamWithAI: (dream: Dream) => Promise<Dream>;
  getEmotionalAnalysis: () => { emotion: string; percentage: number; trend: string }[];
  getDreamsByCategory: (category: string) => Dream[];
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export const useDreamContext = () => {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDreamContext must be used within a DreamProvider');
  }
  return context;
};

export const DreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [deletedDreams, setDeletedDreams] = useState<Dream[]>([]);

  const addDream = (dream: Dream) => {
    // Auto-categorize dream based on content
    const content = dream.content.toLowerCase();
    let category: 'lucid' | 'nightmare' | 'emotional' | 'normal' = 'normal';
    
    if (content.includes('lucid') || content.includes('control') || content.includes('realize') || content.includes('aware')) {
      category = 'lucid';
    } else if (content.includes('nightmare') || content.includes('scary') || content.includes('terrifying') || content.includes('fear')) {
      category = 'nightmare';
    } else if (content.includes('love') || content.includes('sad') || content.includes('happy') || content.includes('cry') || content.includes('emotional')) {
      category = 'emotional';
    }
    
    const categorizedDream = { ...dream, category };
    setDreams(prev => [...prev, dream]);
  };

  const removeDream = (id: string) => {
    const dreamToDelete = dreams.find(d => d.id === id);
    if (dreamToDelete) {
      setDeletedDreams(prev => [...prev, { ...dreamToDelete, isDeleted: true }]);
    }
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  const restoreDream = (id: string) => {
    const dreamToRestore = deletedDreams.find(d => d.id === id);
    if (dreamToRestore) {
      const { isDeleted, ...restoredDream } = dreamToRestore;
      setDreams(prev => [...prev, restoredDream]);
      setDeletedDreams(prev => prev.filter(d => d.id !== id));
    }
  };

  const permanentlyDeleteDream = (id: string) => {
    setDeletedDreams(prev => prev.filter(d => d.id !== id));
  };
  const analyzeDream = async (content: string): Promise<string> => {
    try {
      return await geminiService.analyzeDream(content);
    } catch (error) {
      console.error('Dream analysis failed:', error);
      return 'The dream realm is currently unreachable. Please try again later.';
    }
  };

  const completeDream = async (dreamText: string): Promise<string> => {
    try {
      return await geminiService.completeDream(dreamText);
    } catch (error) {
      console.error('Dream completion failed:', error);
      return '...the dream fades into whispers of the unconscious...';
    }
  };

  const enhanceDreamWithAI = async (dream: Dream): Promise<Dream> => {
    try {
      const [emotions, symbols, characters] = await Promise.all([
        geminiService.detectEmotions(dream.content),
        geminiService.detectSymbols(dream.content),
        geminiService.generateDreamCharacters(dream.content)
      ]);

      return {
        ...dream,
        emotions,
        symbols,
        characters
      };
    } catch (error) {
      console.error('Dream enhancement failed:', error);
      return dream;
    }
  };

  const getEmotionalAnalysis = () => {
    const allEmotions = dreams.flatMap(d => d.emotions);
    const emotionCounts = allEmotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalDreams = dreams.length || 1;
    
    return Object.entries(emotionCounts)
      .map(([emotion, count]) => ({
        emotion,
        percentage: Math.round((count / totalDreams) * 100),
        trend: count > totalDreams * 0.3 ? 'increasing' : count > totalDreams * 0.1 ? 'stable' : 'decreasing'
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);
  };

  const getDreamsByCategory = (category: string) => {
    switch (category) {
      case 'lucid':
        return dreams.filter(d => d.category === 'lucid');
      case 'nightmare':
        return dreams.filter(d => d.category === 'nightmare');
      case 'emotional':
        return dreams.filter(d => d.category === 'emotional');
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return dreams.filter(d => new Date(d.date) > weekAgo);
      default:
        return dreams;
    }
  };
  return (
    <DreamContext.Provider value={{
      dreams,
      deletedDreams,
      addDream,
      removeDream,
      restoreDream,
      permanentlyDeleteDream,
      analyzeDream,
      completeDream,
      enhanceDreamWithAI,
      getEmotionalAnalysis,
      getDreamsByCategory
    }}>
      {children}
    </DreamContext.Provider>
  );
};