import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  currentProduct: null,
};

// ✅ Improved token retrieval
const getValidToken = (getState) => {
  const stateToken = getState().auth.token;
  let sessionToken = null;

  try {
    sessionToken = JSON.parse(sessionStorage.getItem("token"));
  } catch {
    sessionToken = sessionStorage.getItem("token");
  }

  return stateToken || sessionToken || null;
};

export const addNewProducts = createAsyncThunk(
  "products/addNewProducts",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const token = getValidToken(getState);
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/home/products/add`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/home/products/get`
    );
    return result.data;
  }
);

export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getValidToken(getState);
      if (!token) throw new Error("No token found");

      const owner = getState().auth.user?.id;
      const payload = { ...formData, owner };

      const result = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/home/products/edit/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return result.data;
    } catch (err) {
      console.error("Edit Product Error:", err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getValidToken(getState);
      if (!token) throw new Error("No token found");

      const result = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/home/products/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return result.data;
    } catch (err) {
      console.error("Delete Product Error:", err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/home/products/get/${id}`
    );
    return res.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        console.log("API Response Data:", action.payload.data);
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.isLoading = false;
        state.currentProduct = null;
      });
  },
});

export default productSlice.reducer;
