import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import AuthService from '../../services/AuthService';

interface AuthState {
  isAuthenticated: boolean;
  uid?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  uid: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initAuthorization: (state) => {
      if (AuthService.isAuthenticated()) {
        state.isAuthenticated = true;
        state.uid = AuthService.getUserId()!;
      } else {
        state.isAuthenticated = false;
        state.uid = '';
      }
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (action.payload) {
        state.uid = AuthService.getUserId()!;
      }
    },
  },
})

export const { initAuthorization, setAuthenticated } = authSlice.actions
export default authSlice.reducer