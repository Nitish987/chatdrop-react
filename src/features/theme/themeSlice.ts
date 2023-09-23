import { createSlice } from '@reduxjs/toolkit'
import Theme from '../../settings/theme/theme'

interface ThemeState {
  theme: string
}

const initialState: ThemeState = {
  theme: Theme.light
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    loadThemeData: (state) => {
      state.theme = Theme.loadThemeData();
    },
    setLightTheme: (state) => {
      state.theme = Theme.light;
      Theme.setThemeData(Theme.light);
    },
    setDarkTheme: (state) => {
      state.theme = Theme.dark;
      Theme.setThemeData(Theme.dark);
    },
  },
})

export const { loadThemeData, setLightTheme, setDarkTheme } = themeSlice.actions
export default themeSlice.reducer