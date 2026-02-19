import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { connectionAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  bio?: string;
  skills?: string[];
  location?: string;
  createdAt: string;
  connectionStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
  isRequester?: boolean;
}

interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  requester: User;
  receiver: User;
}

interface ConnectionsState {
  connections: Connection[];
  users: User[];
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

const initialState: ConnectionsState = {
  connections: [],
  users: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchConnections = createAsyncThunk(
  'connections/fetchConnections',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await connectionAPI.getConnections(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connections');
    }
  }
);

export const createConnection = createAsyncThunk(
  'connections/createConnection',
  async (connectionData: { receiverId: string; message?: string }, { rejectWithValue }) => {
    try {
      const response = await connectionAPI.createConnection(connectionData);
      return response.data.data.connection;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send connection request');
    }
  }
);

export const updateConnection = createAsyncThunk(
  'connections/updateConnection',
  async ({ id, status }: { id: string; status: 'ACCEPTED' | 'REJECTED' }, { rejectWithValue }) => {
    try {
      const response = await connectionAPI.updateConnection(id, { status });
      return response.data.data.connection;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update connection');
    }
  }
);

export const deleteConnection = createAsyncThunk(
  'connections/deleteConnection',
  async (id: string, { rejectWithValue }) => {
    try {
      await connectionAPI.deleteConnection(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete connection');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'connections/fetchUsers',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await connectionAPI.getUsers(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserConnectionStatus: (state, action) => {
      const { userId, status, isRequester } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].connectionStatus = status;
        state.users[userIndex].isRequester = isRequester;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch connections
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload.connections;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create connection
      .addCase(createConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.connections.unshift(action.payload);
        
        // Update user connection status
        const receiverId = action.payload.receiverId;
        const userIndex = state.users.findIndex(user => user.id === receiverId);
        if (userIndex !== -1) {
          state.users[userIndex].connectionStatus = 'PENDING';
          state.users[userIndex].isRequester = true;
        }
      })
      .addCase(createConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update connection
      .addCase(updateConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConnection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.connections.findIndex(conn => conn.id === action.payload.id);
        if (index !== -1) {
          state.connections[index] = action.payload;
        }
      })
      .addCase(updateConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete connection
      .addCase(deleteConnection.fulfilled, (state, action) => {
        state.connections = state.connections.filter(conn => conn.id !== action.payload);
      })
      
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUserConnectionStatus } = connectionsSlice.actions;
export default connectionsSlice.reducer;