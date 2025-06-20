import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchConfigurations = createAsyncThunk(
  "configurations/fetchConfigurations",
  async ({ pageSize = 10, pageNumber = 1, cityId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (pageSize) params.append("pageSize", pageSize);
      if (pageNumber) params.append("pageNumber", pageNumber);
      if (cityId !== undefined) params.append("cityId", cityId);
      const token = getToken();
      const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
      const response = await fetch(
        `${backend_url}/configuration?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch configurations");
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const configurationsSlice = createSlice({
  name: "configurations",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigurations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchConfigurations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
const getToken = () =>
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhTTEhocVlqaGY5amlQMzZQLTcwZ1lyaFBIOCIsImtpZCI6IkhTTEhocVlqaGY5amlQMzZQLTcwZ1lyaFBIOCJ9.eyJpc3MiOiJodHRwczovL21pbmVydmEudGVzdDAxLmNpdHl3b25kZXJzLmNvbS9pZGVudGl0eSIsImF1ZCI6Imh0dHBzOi8vbWluZXJ2YS50ZXN0MDEuY2l0eXdvbmRlcnMuY29tL2lkZW50aXR5L3Jlc291cmNlcyIsImV4cCI6MTc1MDQ0MzQ2NCwibmJmIjoxNzUwNDI5MDY0LCJjbGllbnRfaWQiOiJMQk8iLCJzY29wZSI6WyJhcGlfcmVhZF9zY29wZSIsImFwaV93cml0ZV9zY29wZSIsIm9wZW5pZCIsInJvbGVzIl0sInN1YiI6IjQ2MTYiLCJhdXRoX3RpbWUiOjE3NTA0MjkwNjQsImlkcCI6Imlkc3J2IiwibmFtZSI6IkdpYW5waWVybyBGZXJyYXJvIiwicm9sZSI6WyJCYWNrb2ZmaWNlIFN1cGVyIEFkbWluIiwiVmlldyBTdXBwbGllciBVc2VycyIsIk1hbmFnZSBTdXBwbGllciBVc2VycyIsIlZpZXcgR3VpZGUgVXNlcnMiLCJNYW5hZ2UgR3VpZGUgVXNlcnMiLCJWaWV3IFVzZXJzIiwiTWFuYWdlIFVzZXJzIiwiVmlldyBSb2xlcyBhbmQgUGVybWlzc2lvbnMiLCJNYW5hZ2UgUm9sZXMgYW5kIFBlcm1pc3Npb25zIiwiRGVmYXVsdCBQZXJtaXNzaW9ucyIsIk1hbmFnZW1lbnQgR2VuZXJhbCIsIkRldmVsb3BlciIsIk9wcyBTdXBlcnZpc29yIiwiU0NDIFN1cGVydmlzb3IiLCJGb3JlY2FzdGluZyIsIkd1aWRlIE1hbmFnZW1lbnQiLCJHdWlkZSIsIkNvb3JkaW5hdG9yIiwiTW9iaWxlIENvb3JkaW5hdGlvbiBBcHAiLCJPUHMgU2VuaW9yL0d1aWRlIE1hbmFnZW1lbnQiLCJHdWlkZSBTY2hlZHVsaW5nIFNlbmlvciIsIlJldmVudWUiLCJNYW5hZ2UgUHJpY2VzIEJ1bGsiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZ2lhbnBpZXJvLmZlcnJhcm8iLCJnaXZlbl9uYW1lIjoiR2lhbnBpZXJvIiwiZmFtaWx5X25hbWUiOiJGZXJyYXJvIiwiZW1haWwiOiJnaWFucGllcm8uZmVycmFyb0BjaXR5d29uZGVycy5jb20iLCJhbXIiOlsicGFzc3dvcmQiXX0.G5JxvtcXalnfafeRPlPP5bk6KvR9BFqNVW2gTxbYuHk0vRSyEtqo6wiYSwHCK7E0DLwXVKygqep8owUaciRRVpnVNx-uw0AIXmmpI1dGtJWegkZwcRJlJG3TXuExmgEzr0_ubsZH-kKF_hYDF22YilUDLSw59VUbLvBlhkF0UDvdPkZfu0bvtjAfhBt3oDmN-N_j3NrnsfKOc9bGZvLaGaMVWwZZQMntD_EHyVeIoPCGLivVo6LERTu-C9OHaYJfOCPINkvFE_UyGUhmkBiYn2PPLxNqvKMfRhe_T0Yv9L9og98rdXQKrWD5adkKiibWisyfKzSaN8U5LjFuRgbUAA"
export default configurationsSlice.reducer;
