import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingAPI } from '@/lib/api';

interface Booking {
  id: string;
  mentorId: string;
  menteeId: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
  };
  mentee: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface BookingsState {
  bookings: Booking[];
  availableSlots: Date[];
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

const initialState: BookingsState = {
  bookings: [],
  availableSlots: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getBookings(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: any, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.createBooking(bookingData);
      return response.data.data.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.updateBooking(id, data);
      return response.data.data.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
    }
  }
);

export const fetchMentorSlots = createAsyncThunk(
  'bookings/fetchMentorSlots',
  async ({ mentorId, date }: { mentorId: string; date: string }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getMentorSlots(mentorId, { date });
      return response.data.data.availableSlots;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mentor slots');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      
      // Fetch mentor slots
      .addCase(fetchMentorSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentorSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchMentorSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAvailableSlots } = bookingsSlice.actions;
export default bookingsSlice.reducer;