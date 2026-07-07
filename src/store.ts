import { create } from 'zustand';
import { Software, Category, PageType, Stats, Workflow } from './types';
import { mockSoftware, mockCategories, mockStats, mockWorkflows } from './mockData';

interface AppState {
  currentPage: PageType;
  selectedCategory: string | null;
  searchQuery: string;
  isSearching: boolean;
  software: Software[];
  categories: Category[];
  stats: Stats;
  workflows: Workflow[];
  viewMode: 'grid' | 'list';
  setCurrentPage: (page: PageType) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  launchApp: (softwareId: string) => void;
  launchWorkflow: (workflowId: string) => void;
  toggleWorkflowFavorite: (workflowId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentPage: 'dashboard',
  selectedCategory: null,
  searchQuery: '',
  isSearching: false,
  software: mockSoftware,
  categories: mockCategories,
  stats: mockStats,
  workflows: mockWorkflows,
  viewMode: 'grid',

  setCurrentPage: (page) => set({ currentPage: page, selectedCategory: null }),
  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 'all' }),
  setSearchQuery: (query) => set({ searchQuery: query, isSearching: query.length > 0 }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setViewMode: (mode) => set({ viewMode: mode }),

  launchApp: (softwareId) => {
    const { software } = get();
    const updated = software.map(app =>
      app.id === softwareId
        ? { ...app, launchCount: app.launchCount + 1 }
        : app
    );
    set({ software: updated });
    console.log(`Launched app: ${softwareId}`);
  },

  launchWorkflow: (workflowId) => {
    const { workflows } = get();
    const updated = workflows.map(w =>
      w.id === workflowId
        ? { ...w, usageCount: w.usageCount + 1, lastUsed: new Date().toISOString() }
        : w
    );
    set({ workflows: updated });
    console.log(`Launched workflow: ${workflowId}`);
  },

  toggleWorkflowFavorite: (workflowId) => {
    const { workflows } = get();
    const updated = workflows.map(w =>
      w.id === workflowId ? { ...w, isFavorite: !w.isFavorite } : w
    );
    set({ workflows: updated });
  },
}));
