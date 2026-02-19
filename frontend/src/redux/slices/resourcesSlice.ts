import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resourceAPI } from '@/lib/api';

interface Resource {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  category: string;
  uploadedBy: string;
  isPublic: boolean;
  downloads: number;
  createdAt: string;
  uploader: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ResourcesState {
  resources: Resource[];
  myResources: Resource[];
  currentResource: Resource | null;
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

const initialState: ResourcesState = {
  resources: [],
  myResources: [],
  currentResource: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await resourceAPI.getResources(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resources');
    }
  }
);

export const fetchResourceById = createAsyncThunk(
  'resources/fetchResourceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resourceAPI.getResourceById(id);
      return response.data.data.resource;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resource');
    }
  }
);

export const createResource = createAsyncThunk(
  'resources/createResource',
  async (resourceData: FormData, { rejectWithValue }) => {
    try {
      const response = await resourceAPI.createResource(resourceData);
      return response.data.data.resource;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create resource');
    }
  }
);

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await resourceAPI.updateResource(id, data);
      return response.data.data.resource;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update resource');
    }
  }
);

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (id: string, { rejectWithValue }) => {
    try {
      await resourceAPI.deleteResource(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete resource');
    }
  }
);

export const downloadResource = createAsyncThunk(
  'resources/downloadResource',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resourceAPI.downloadResource(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download resource');
    }
  }
);

export const fetchMyResources = createAsyncThunk(
  'resources/fetchMyResources',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await resourceAPI.getMyResources(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your resources');
    }
  }
);

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentResource: (state) => {
      state.currentResource = null;
    },
    incrementDownloadCount: (state, action) => {
      const resourceId = action.payload;
      
      // Update in resources array
      const resourceIndex = state.resources.findIndex(resource => resource.id === resourceId);
      if (resourceIndex !== -1) {
        state.resources[resourceIndex].downloads += 1;
      }
      
      // Update in myResources array
      const myResourceIndex = state.myResources.findIndex(resource => resource.id === resourceId);
      if (myResourceIndex !== -1) {
        state.myResources[myResourceIndex].downloads += 1;
      }
      
      // Update current resource
      if (state.currentResource?.id === resourceId) {
        state.currentResource.downloads += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resources
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload.resources;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch resource by ID
      .addCase(fetchResourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResource = action.payload;
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create resource
      .addCase(createResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.loading = false;
        state.resources.unshift(action.payload);
        state.myResources.unshift(action.payload);
      })
      .addCase(createResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update resource
      .addCase(updateResource.fulfilled, (state, action) => {
        const index = state.resources.findIndex(resource => resource.id === action.payload.id);
        if (index !== -1) {
          state.resources[index] = action.payload;
        }
        
        const myIndex = state.myResources.findIndex(resource => resource.id === action.payload.id);
        if (myIndex !== -1) {
          state.myResources[myIndex] = action.payload;
        }
        
        if (state.currentResource?.id === action.payload.id) {
          state.currentResource = action.payload;
        }
      })
      
      // Delete resource
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter(resource => resource.id !== action.payload);
        state.myResources = state.myResources.filter(resource => resource.id !== action.payload);
        
        if (state.currentResource?.id === action.payload) {
          state.currentResource = null;
        }
      })
      
      // Download resource
      .addCase(downloadResource.fulfilled, (state, action) => {
        // The actual download is handled in the component
        // This is just for tracking purposes
      })
      
      // Fetch my resources
      .addCase(fetchMyResources.fulfilled, (state, action) => {
        state.myResources = action.payload.resources;
      });
  },
});

export const { clearError, clearCurrentResource, incrementDownloadCount } = resourcesSlice.actions;
export default resourcesSlice.reducer;