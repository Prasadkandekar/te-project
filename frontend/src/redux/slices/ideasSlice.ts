import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ideaAPI } from '@/lib/api';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  targetMarket?: string;
  challenges?: string;
  stage: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  feedbacks?: Feedback[];
  _count: {
    feedbacks: number;
  };
}

interface Feedback {
  id: string;
  ideaId: string;
  userId: string;
  comment: string;
  rating?: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}

interface IdeasState {
  ideas: Idea[];
  myIdeas: Idea[];
  currentIdea: Idea | null;
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}

const initialState: IdeasState = {
  ideas: [],
  myIdeas: [],
  currentIdea: null,
  feedbacks: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchIdeas = createAsyncThunk(
  'ideas/fetchIdeas',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.getIdeas(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ideas');
    }
  }
);

export const fetchIdeaById = createAsyncThunk(
  'ideas/fetchIdeaById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.getIdeaById(id);
      return response.data.data.idea;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch idea');
    }
  }
);

export const createIdea = createAsyncThunk(
  'ideas/createIdea',
  async (ideaData: any, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.createIdea(ideaData);
      return response.data.data.idea;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create idea');
    }
  }
);

export const updateIdea = createAsyncThunk(
  'ideas/updateIdea',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.updateIdea(id, data);
      return response.data.data.idea;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update idea');
    }
  }
);

export const deleteIdea = createAsyncThunk(
  'ideas/deleteIdea',
  async (id: string, { rejectWithValue }) => {
    try {
      await ideaAPI.deleteIdea(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete idea');
    }
  }
);

export const fetchMyIdeas = createAsyncThunk(
  'ideas/fetchMyIdeas',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.getMyIdeas(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your ideas');
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'ideas/fetchFeedbacks',
  async ({ ideaId, params = {} }: { ideaId: string; params?: any }, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.getFeedback(ideaId, params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedbacks');
    }
  }
);

export const createFeedback = createAsyncThunk(
  'ideas/createFeedback',
  async ({ ideaId, data }: { ideaId: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.createFeedback(ideaId, data);
      return response.data.data.feedback;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create feedback');
    }
  }
);

export const updateFeedback = createAsyncThunk(
  'ideas/updateFeedback',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await ideaAPI.updateFeedback(id, data);
      return response.data.data.feedback;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update feedback');
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'ideas/deleteFeedback',
  async (id: string, { rejectWithValue }) => {
    try {
      await ideaAPI.deleteFeedback(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete feedback');
    }
  }
);

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentIdea: (state) => {
      state.currentIdea = null;
    },
    clearFeedbacks: (state) => {
      state.feedbacks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ideas
      .addCase(fetchIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = action.payload.ideas;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch idea by ID
      .addCase(fetchIdeaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdeaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIdea = action.payload;
      })
      .addCase(fetchIdeaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create idea
      .addCase(createIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas.unshift(action.payload);
        state.myIdeas.unshift(action.payload);
      })
      .addCase(createIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update idea
      .addCase(updateIdea.fulfilled, (state, action) => {
        const index = state.ideas.findIndex(idea => idea.id === action.payload.id);
        if (index !== -1) {
          state.ideas[index] = action.payload;
        }
        
        const myIndex = state.myIdeas.findIndex(idea => idea.id === action.payload.id);
        if (myIndex !== -1) {
          state.myIdeas[myIndex] = action.payload;
        }
        
        if (state.currentIdea?.id === action.payload.id) {
          state.currentIdea = action.payload;
        }
      })
      
      // Delete idea
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.ideas = state.ideas.filter(idea => idea.id !== action.payload);
        state.myIdeas = state.myIdeas.filter(idea => idea.id !== action.payload);
        
        if (state.currentIdea?.id === action.payload) {
          state.currentIdea = null;
        }
      })
      
      // Fetch my ideas
      .addCase(fetchMyIdeas.fulfilled, (state, action) => {
        state.myIdeas = action.payload.ideas;
      })
      
      // Fetch feedbacks
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload.feedbacks;
      })
      
      // Create feedback
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.feedbacks.unshift(action.payload);
        
        // Update feedback count in current idea
        if (state.currentIdea) {
          state.currentIdea._count.feedbacks += 1;
        }
      })
      
      // Update feedback
      .addCase(updateFeedback.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex(feedback => feedback.id === action.payload.id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
      })
      
      // Delete feedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(feedback => feedback.id !== action.payload);
        
        // Update feedback count in current idea
        if (state.currentIdea) {
          state.currentIdea._count.feedbacks -= 1;
        }
      });
  },
});

export const { clearError, clearCurrentIdea, clearFeedbacks } = ideasSlice.actions;
export default ideasSlice.reducer;