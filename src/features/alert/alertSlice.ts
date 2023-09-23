import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AlertState {
  visible?: boolean;
  message: string;
  type: string;
}

const initialState: AlertState = {
  visible: false,
  message: '',
  type: 'info'
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<AlertState>) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    dismissAlert: (state) => {
      state.visible = false;
      state.message = '';
    },
  },
})

export const { showAlert, dismissAlert } = alertSlice.actions
export default alertSlice.reducer