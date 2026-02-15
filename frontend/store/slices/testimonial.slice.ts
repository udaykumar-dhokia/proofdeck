import axiosClient from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Testimonial = {
  id: string;
  title: string;
  desc: string;
  product_id: string;
  is_name_required: boolean;
  is_role_required: boolean;
  is_company_required: boolean;
  created_at: string;
  updated_at: string;
};

interface TestimonialsState {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TestimonialsState = {
  testimonials: [],
  isLoading: false,
  error: null,
};

export const fetchTestimonialsByProductId = createAsyncThunk(
  "testimonials/fetchByProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/testimonial/p/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch testimonials",
      );
    }
  },
);

export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/testimonial/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch testimonials",
      );
    }
  },
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    addTestimonial: (state, action: PayloadAction<Testimonial>) => {
      state.testimonials.push(action.payload);
    },
    deleteTestimonial: (state, action: PayloadAction<string>) => {
      state.testimonials = state.testimonials.filter(
        (t) => t.id !== action.payload,
      );
    },
    updateTestimonial: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Testimonial> }>,
    ) => {
      const index = state.testimonials.findIndex(
        (t) => t.id === action.payload.id,
      );
      if (index !== -1) {
        state.testimonials[index] = {
          ...state.testimonials[index],
          ...action.payload.changes,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonialsByProductId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTestimonialsByProductId.fulfilled,
        (state, action: PayloadAction<Testimonial[]>) => {
          state.isLoading = false;
          state.testimonials = action.payload;
        },
      )
      .addCase(fetchTestimonialsByProductId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTestimonials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTestimonials.fulfilled,
        (state, action: PayloadAction<Testimonial[]>) => {
          state.isLoading = false;
          state.testimonials = action.payload;
        },
      )
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addTestimonial, deleteTestimonial, updateTestimonial } =
  testimonialSlice.actions;

export default testimonialSlice.reducer;
