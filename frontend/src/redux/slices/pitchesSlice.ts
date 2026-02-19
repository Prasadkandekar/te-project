import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pitchAPI } from '@/lib/api';

interface Pitch {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  uploadedBy: string;
  isPublic: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  uploader: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface PitchesState {
  pitches: Pitch[];
  myPitches: Pitch[];
  currentPitch: Pitch | null;
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

const initialState: PitchesState = {
  pitches: [],
  myPitches: [],
  currentPitch: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchPitches = createAsyncThunk(
  'pitches/fetchPitches',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await pitchAPI.getPitches(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pitches');
    }
  }
);

export const fetchPitchById = createAsyncThunk(
  'pitches/fetchPitchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await pitchAPI.getPitchById(id);
      return response.data.data.pitch;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pitch');
    }
  }
);

export const createPitch = createAsyncThunk(
  'pitches/createPitch',
  async (pitchData: FormData, { rejectWithValue }) => {
    try {
      const response = await pitchAPI.createPitch(pitchData);
      return response.data.data.pitch;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create pitch');
    }
  }
);

export const updatePitch = createAsyncThunk(
  'pitches/updatePitch',
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await pitchAPI.updatePitch(id, data);
      return response.data.data.pitch;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pitch');
    }
  }
);

export const deletePitch = createAsyncThunk(
  'pitches/deletePitch',
  async (id: string, { rejectWithValue }) => {
    try {
      await pitchAPI.deletePitch(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete pitch');
    }
  }
);

export const fetchMyPitches = createAsyncThunk(
  'pitches/fetchMyPitches',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await pitchAPI.getMyPitches(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your pitches');
    }
  }
);

const pitchesSlice = createSlice({
  name: 'pitches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPitch: (state) => {
      state.currentPitch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pitches
      .addCase(fetchPitches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPitches.fulfilled, (state, action) => {
        state.loading = false;
        state.pitches = action.payload.pitches;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPitches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch pitch by ID
      .addCase(fetchPitchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPitchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPitch = action.payload;
      })
      .addCase(fetchPitchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create pitch
      .addCase(createPitch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPitch.fulfilled, (state, action) => {
        state.loading = false;
        state.pitches.unshift(action.payload);
        state.myPitches.unshift(action.payload);
      })
      .addCase(createPitch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update pitch
      .addCase(updatePitch.fulfilled, (state, action) => {
        const index = state.pitches.findIndex(pitch => pitch.id === action.payload.id);
        if (index !== -1) {
          state.pitches[index] = action.payload;
        }
        
        const myIndex = state.myPitches.findIndex(pitch => pitch.id === action.payload.id);
        if (myIndex !== -1) {
          state.myPitches[myIndex] = action.payload;
        }
        
        if (state.currentPitch?.id === action.payload.id) {
          state.currentPitch = action.payload;
        }
      })
      
      // Delete pitch
      .addCase(deletePitch.fulfilled, (state, action) => {
        state.pitches = state.pitches.filter(pitch => pitch.id !== action.payload);
        state.myPitches = state.myPitches.filter(pitch => pitch.id !== action.payload);
        
        if (state.currentPitch?.id === action.payload) {
          state.currentPitch = null;
        }
      })
      
      // Fetch my pitches
      .addCase(fetchMyPitches.fulfilled, (state, action) => {
        state.myPitches = action.payload.pitches;
      });
  },
});

export const { clearError, clearCurrentPitch } = pitchesSlice.actions;
export default pitchesSlice.reducer;