import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roadmapAPI } from '@/lib/api';

export interface Milestone {
  id: string;
  phaseId: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface Phase {
  id: string;
  roadmapId: string;
  phaseNumber: number;
  title: string;
  weekRange: string;
  goal: string;
  milestones: Milestone[];
  successMetrics: string[];
  recommendedTools: string[];
  createdAt: string;
}

export interface Roadmap {
  id: string;
  ideaId: string;
  phases: Phase[];
  createdAt: string;
}

interface RoadmapState {
  roadmap: Roadmap | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoadmapState = {
  roadmap: null,
  loading: false,
  error: null,
};

export const generateRoadmap = createAsyncThunk(
  'roadmap/generate',
  async (ideaId: string, { rejectWithValue }) => {
    try {
      const response = await roadmapAPI.generate(ideaId);
      return response.data.data as Roadmap;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate roadmap');
    }
  }
);

export const fetchRoadmap = createAsyncThunk(
  'roadmap/fetch',
  async (ideaId: string, { rejectWithValue }) => {
    try {
      const response = await roadmapAPI.getRoadmap(ideaId);
      return response.data.data as Roadmap;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roadmap');
    }
  }
);

export const toggleMilestone = createAsyncThunk(
  'roadmap/toggleMilestone',
  async (
    { milestoneId, completed }: { milestoneId: string; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await roadmapAPI.updateMilestone(milestoneId, completed);
      return response.data.data as Milestone;
    } catch (error: any) {
      return rejectWithValue({ message: error.response?.data?.message || 'Failed to update milestone', milestoneId, completed: !completed });
    }
  }
);

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRoadmap: (state) => {
      state.roadmap = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate roadmap
      .addCase(generateRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmap = action.payload;
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch roadmap
      .addCase(fetchRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmap = action.payload;
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle milestone — optimistic update
      .addCase(toggleMilestone.pending, (state, action) => {
        const { milestoneId, completed } = action.meta.arg;
        if (!state.roadmap) return;
        for (const phase of state.roadmap.phases) {
          const milestone = phase.milestones.find((m) => m.id === milestoneId);
          if (milestone) {
            milestone.completed = completed;
            milestone.completedAt = completed ? new Date().toISOString() : null;
            break;
          }
        }
      })
      .addCase(toggleMilestone.fulfilled, (state, action) => {
        if (!state.roadmap) return;
        const updated = action.payload;
        for (const phase of state.roadmap.phases) {
          const idx = phase.milestones.findIndex((m) => m.id === updated.id);
          if (idx !== -1) {
            phase.milestones[idx] = updated;
            break;
          }
        }
      })
      .addCase(toggleMilestone.rejected, (state, action) => {
        // Rollback optimistic update
        const payload = action.payload as { message: string; milestoneId: string; completed: boolean };
        state.error = payload?.message || 'Failed to update milestone';
        if (!state.roadmap || !payload?.milestoneId) return;
        for (const phase of state.roadmap.phases) {
          const milestone = phase.milestones.find((m) => m.id === payload.milestoneId);
          if (milestone) {
            milestone.completed = payload.completed;
            milestone.completedAt = payload.completed ? milestone.completedAt : null;
            break;
          }
        }
      });
  },
});

export const { clearError, clearRoadmap } = roadmapSlice.actions;
export default roadmapSlice.reducer;
