import axiosClient from "@/utils/api"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Company = {
    id: string
    name: string
    email: string
    password: string
    website?: string
    created_at: string
    updated_at: string
}

interface CompanyState {
    company: Company | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

const initialState: CompanyState = {
    company: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
}

export const fetchCompany = createAsyncThunk<Company>(
    "company/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/company/")
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch company")
        }
    }
)

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompany.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<Company>) => {
                state.isLoading = false
                state.company = action.payload
                state.isAuthenticated = true
            })
            .addCase(fetchCompany.rejected, (state, action) => {
                state.isLoading = false
                state.company = null
                state.isAuthenticated = false
                state.error = action.payload as string
            })
    }
})

export default companySlice.reducer
