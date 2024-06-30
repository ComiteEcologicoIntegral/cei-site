import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const dataSlice = createSlice({
  name: "data",
  initialState: { sensorData: [], sensorDataLastUpdate: null },
  reducers: {
    setSensorData(state, action) {
      if (Array.isArray(action.payload)) {
        state.sensorData = action.payload;
        state.sensorDataLastUpdate = moment();
      }
    },
  },
});

export const { setSensorData } = dataSlice.actions;
export default dataSlice.reducer;
