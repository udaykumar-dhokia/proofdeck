import axiosClient from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Product = {
  id: string;
  name: string;
  desc: string;
  website: string;
  company_id: string;
  created_at: string;
  updated_at: string;
};

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

type UpdateProductPayload = {
  id: string;
  changes: Partial<Product>;
};

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/product/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch products",
      );
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    deleteProduct: (state, action: PayloadAction<String>) => {
      state.products = state.products.filter((p) => p.id != action.payload);
    },
    updateProduct: (state, action: PayloadAction<UpdateProductPayload>) => {
      const { id, changes } = action.payload;

      const index = state.products.findIndex((p) => p.id === id);

      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...changes,
          updated_at: new Date().toISOString(),
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [];
        state.error = action.payload as string;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  },
});

export const { addProduct, deleteProduct, updateProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
