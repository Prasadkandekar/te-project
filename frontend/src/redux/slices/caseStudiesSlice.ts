import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface TimelineEvent {
  year: number;
  event: string;
  impact: string;
}

interface Competitor {
  name: string;
  foundedYear: number;
  founders: string;
  story: string;
  timeline: TimelineEvent[];
  keyLessons: string[];
  currentStatus: string;
  differentiators: string[];
}

interface CaseStudy {
  id: string;
  ideaId: string;
  competitors: Competitor[];
  createdAt: string;
}

interface CaseStudiesState {
  caseStudies: CaseStudy[];
  currentCaseStudy: CaseStudy | null;
  loading: boolean;
  error: string | null;
}

const initialState: CaseStudiesState = {
  caseStudies: [],
  currentCaseStudy: null,
  loading: false,
  error: null,
};

export const generateCaseStudies = createAsyncThunk(
  'caseStudies/generate',
  async (ideaId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/case-studies', { ideaId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate case studies');
    }
  }
);

export const fetchCaseStudies = createAsyncThunk(
  'caseStudies/fetch',
  async (ideaId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/case-studies/${ideaId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch case studies');
    }
  }
);

const caseStudiesSlice = createSlice({
  name: 'caseStudies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateCaseStudies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCaseStudies.fulfilled, (state, action: PayloadAction<CaseStudy>) => {
        state.loading = false;
        state.currentCaseStudy = action.payload;
        state.caseStudies.unshift(action.payload);
      })
      .addCase(generateCaseStudies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCaseStudies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseStudies.fulfilled, (state, action: PayloadAction<CaseStudy[]>) => {
        state.loading = false;
        state.caseStudies = action.payload;
        state.currentCaseStudy = action.payload[0] || null;
      })
      .addCase(fetchCaseStudies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = caseStudiesSlice.actions;
export default caseStudiesSlice.reducer;
