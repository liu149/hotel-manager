import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  email: null,
  token: null,
  expirationTime: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.expirationTime = action.payload.expirationTime;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;

export default userSlice.reducer;