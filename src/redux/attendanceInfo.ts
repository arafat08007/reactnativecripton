import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunk, RootState } from './store';
import api from '~/api';
import { toString } from '~/helpers';

export interface CompanySummary {
  CompanyId: string;
  Company: string;
  Absent: string;
  Present: string;
  Manpower: string;
  Leave: string;

  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  depts: any[];
}

interface AttendanceInfoState {
  summary: CompanySummary[];
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
}

const initialState: AttendanceInfoState = {
  summary: [],
  status: 'idle',
};

export const fetchAttendanceSummary = createAsyncThunk(
  'attendanceInfo/fetchSummary',
  async (date?: Date) => {
    const { data } = await api.get('/GetAttendanceSummary', {
      params: {
        Dates: toString(date || new Date()),
      },
    });

    return data;
  },
);

export const fetchCompanySummary = createAsyncThunk(
  'attendanceInfo/fetchCompanySummary',
  async ({ date, id }: { date?: Date; id: string }) => {
    const { data } = await api.get('/GetAttendanceSummaryByComp', {
      params: {
        Dates: toString(date || new Date()),
        CId: id,
      },
    });

    return data;
  },
);

const attendanceInfoSlice = createSlice({
  name: 'attendanceInfo',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder.addCase(fetchAttendanceSummary.pending, (state, { payload }) => {
      state.status = 'pending';
    });
    builder.addCase(fetchAttendanceSummary.fulfilled, (state, { payload }) => {
      state.summary = payload;
      state.status = 'fulfilled';
    });
    builder.addCase(fetchAttendanceSummary.rejected, (state, { payload }) => {
      state.status = 'rejected';
    });

    builder.addCase(
      fetchCompanySummary.pending,
      (state, { payload, meta: { arg } }) => {
        const companyIdx = state.summary.findIndex(x => x.CompanyId === arg.id);
        if (companyIdx >= 0) {
          state.summary[companyIdx].status = 'pending';
        }
      },
    );
    builder.addCase(
      fetchCompanySummary.fulfilled,
      (state, { payload, meta: { arg } }) => {
        const companyIdx = state.summary.findIndex(x => x.CompanyId === arg.id);
        if (companyIdx >= 0) {
          state.summary[companyIdx].depts = payload;
          state.summary[companyIdx].status = 'fulfilled';
        }
      },
    );
    builder.addCase(
      fetchCompanySummary.rejected,
      (state, { payload, meta: { arg } }) => {
        const companyIdx = state.summary.findIndex(x => x.CompanyId === arg.id);
        if (companyIdx >= 0) {
          state.summary[companyIdx].status = 'rejected';
        }
      },
    );
  },
});

const x = fetchAttendanceSummary.fulfilled.name;

export default attendanceInfoSlice.reducer;
