import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  complaintDataList: [],
  updatedComplaintData: null,
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    setComplaintList: (state, action) => {
      state.complaintDataList = action.payload;
    },
    updateComplaint: (state, action) => {
      state.updatedComplaintData = action.payload;
    },
  },
});

export const { setComplaintList, updateComplaint } = complaintSlice.actions;
export default complaintSlice.reducer; 