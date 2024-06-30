import { createSlice } from '@reduxjs/toolkit';
import { systemOptions } from '../constants';

const initialState = {
  system: systemOptions[0],
  location: null,
  contaminant: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setSystem(state, action) {
      state.system = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setContaminant(state, action) {
      state.contaminant = action.payload;
    },
  },
});

export const { setSystem, setLocation, setContaminant } = formSlice.actions;

export default formSlice.reducer;
