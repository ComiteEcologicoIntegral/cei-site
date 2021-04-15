import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = { sensorData: [], sensorDataLastUpdate: null };

const dataSlice = createSlice({
    name: 'data',
    initialState,
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
