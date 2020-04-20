import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunk, RootState } from './store';
import api from '~/api';
import { toString } from '~/helpers';

interface LeaveType {
  Text: string;
  Value: string;
}

interface LeaveInfo {
  LvID: string;
  LvName: string;
  LvAssigned: string;
  LvEnjoyed: string;
  LvBalance: string;
}

interface LeaveState {
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  types: LeaveType[];
  balance: LeaveInfo[];
  message?: { Text: string; Value: string };
}

const initialState: LeaveState = {
  status: 'idle',
  types: [],
  balance: [],
};

export const fetchData = createAsyncThunk<any, void, { state: RootState }>(
  'leave/fetchData',
  async (undefined, thunkApi) => {
    const { data: typeData } = await api.get('/SspListLeaveType ');
    const { user } = thunkApi.getState().auth;
    const { data: balanceData } = await api.get('/SspViewLeaveBalance', {
      params: {
        EmpId: user?.EmpId,
        Year: new Date().getFullYear(),
      },
    });
    return { typeData, balanceData };
  },
);

export const submitRequest = createAsyncThunk<any, any, { state: RootState }>(
  'leave/submitRequest',
  async (data, thunkApi) => {
    const { user } = thunkApi.getState().auth;
    const { data: resData } = await api.get('/SspSaveReqLeave', {
      params: {
        ...data,
        sDate: toString(data.sDate),
        eDate: toString(data.eDate),
        EmpId: user?.EmpId,
        DocId: 'a8e6a4b1-e694-49d6-8059-53f2d14ef767',
      },
    });
    return resData;
  },
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearMessage(state) {
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
      state.status = 'pending';
    });

    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      state.status = 'fulfilled';
      state.types = payload.typeData;
      state.balance = payload.balanceData;
    });

    builder.addCase(fetchData.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(submitRequest.pending, (state, action) => {
      state.status = 'pending';
    });
    builder.addCase(submitRequest.fulfilled, (state, action) => {
      state.message = action.payload;
      state.status = 'fulfilled';
    });
    builder.addCase(submitRequest.rejected, (state, action) => {
      state.status = 'rejected';
      state.message = { Text: 'Submission Failed', Value: '-1' };
    });
  },
});

export const { clearMessage } = leaveSlice.actions;

export default leaveSlice.reducer;
