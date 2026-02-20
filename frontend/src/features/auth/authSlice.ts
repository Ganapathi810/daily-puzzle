import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/* ---------- Types ---------- */

export interface User {
  id: string;
  email: string;
  streakCount: number;
  totalPoints: number;
  lastPlayed: string; // backend returns string, not Date
}

interface AuthState {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
}

/* ---------- Async Thunk ---------- */

export const fetchUser = createAsyncThunk<
  { user: User | null; isGuest: boolean }
>("auth/fetchUser", async () => {
  const res = await fetch(`/api/auth/me`, {
    credentials: "include",
  });

  if (res.ok) {
    const user = (await res.json()) as User;
    return { user, isGuest: false };
  }

  const isGuest =
    localStorage.getItem("authMode") === "guest";

  return { user: null, isGuest };
});

/* ---------- Initial State ---------- */

const initialState: AuthState = {
  user: null,
  isGuest: false,
  loading: true,
};

/* ---------- Slice ---------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isGuest = false;
      state.loading = false;

      // Clean guest mode if present
      localStorage.removeItem("authMode");
      localStorage.removeItem("guestId");
      localStorage.removeItem("guestCreatedAt");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isGuest = action.payload.isGuest;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isGuest = false;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
