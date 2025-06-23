import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || "",
  status: "idle",
  error: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const body = new URLSearchParams();
      body.append("userName", username);
      body.append("password", password);
      const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const res = await fetch(`${backend_url}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to sign in");
      }
      const data = await res.json();
      return data.accessToken;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut(state) {
      state.token = "";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
        localStorage.setItem("token", action.payload);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
