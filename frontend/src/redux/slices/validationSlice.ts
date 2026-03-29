import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { validationAPI } from '@/lib/api';

export interface DimensionScores {
  marketDemand: number;
  competitiveGap: number;
  executionFeasibility: number;
  revenuePotential: number;
  timingTrends: number;
}

export interface Competitor {
  name: string;
  positioningNote: string;
  threatLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Persona {
  demographics: string;
  painPoints: string[];
  willingnessToPay: string;
  channels: string[];
}

export interface Swot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ValidationReport {
  id: string;
  ideaId: string;
  score: number;
  pivotRecommended: boolean;
  pivotSuggestions: string[];
  dimensionScores: DimensionScores;
  swot: Swot;
  competitors: Competitor[];
  persona: Persona;
  checklist: string[];
  createdAt: string;
}

interface ValidationState {
  currentReport: ValidationReport | null;
  history: ValidationReport[];
  loading: boolean;
  error: string | null;
}

const initialState: ValidationState = {
  currentReport: null,
  history: [],
  loading: false,
  error: null,
};

export const runValidation = createAsyncThunk(
  'validation/runValidation',
  async (ideaId: string, { rejectWithValue }) => {
    try {
      const response = await validationAPI.runValidation(ideaId);
      return response.data.data as ValidationReport;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Validation failed');
    }
  }
);

export const fetchValidationHistory = createAsyncThunk(
  'validation/fetchHistory',
  async (ideaId: string, { rejectWithValue }) => {
    try {
      const response = await validationAPI.getHistory(ideaId);
      return response.data.data as ValidationReport[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch validation history');
    }
  }
);

const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Run validation
      .addCase(runValidation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runValidation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(runValidation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch history
      .addCase(fetchValidationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchValidationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchValidationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentReport } = validationSlice.actions;
export default validationSlice.reducer;
