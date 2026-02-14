import axiosClient from "@/utils/api";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type Company = {
  id: string;
  name: string;
  email: string;
  password: string;
  website?: string;
  created_at: string;
  updated_at: string;
};

export type CompanyStats = {
  total_products: number;
  total_testimonials: number;
  testimonials_per_product: {
    product_name: string;
    count: number;
  }[];
};

interface CompanyState {
  company: Company | null;
  stats: CompanyStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: CompanyState = {
  company: null,
  stats: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const fetchCompany = createAsyncThunk<Company>(
  "company/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/company/");
      return response.data.company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch company");
    }
  },
);

export const fetchCompanyStats = createAsyncThunk<CompanyStats>(
  "company/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/company/stats");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch company stats",
      );
    }
  },
);

export const logoutCompany = createAsyncThunk(
  "company/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.get("/auth/logout");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to logout company",
      );
    }
  },
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.isLoading = false;
          state.company = action.payload;
          state.isAuthenticated = true;
          state.isInitialized = true;
        },
      )
      .addCase(fetchCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.company = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      })
      .addCase(
        fetchCompanyStats.fulfilled,
        (state, action: PayloadAction<CompanyStats>) => {
          state.stats = action.payload;
        },
      )
      .addCase(logoutCompany.fulfilled, (state) => {
        state.company = null;
        state.stats = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })
      .addCase(logoutCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.company = null;
        state.stats = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      })
      .addCase(logoutCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  },
});

export default companySlice.reducer;
