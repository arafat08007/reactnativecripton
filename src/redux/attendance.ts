import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Geolocation from 'react-native-geolocation-service';

import { AppThunk, RootState } from './store';
import api from '~/api';

interface DailyStatus {
  InTime: string;
  OutTime: string;
  Status: string;
}

interface DailySummary {
  Atndate: string;
  Intime: string;
  Outdate: string;
  Outtime: string;
  status: string;
  SL: string;
}

interface AttendanceState {
  dailyStatus: DailyStatus;
  monthlySummary: DailySummary[];
  showModal: boolean;
}

const initialState: AttendanceState = {
  dailyStatus: { InTime: '', OutTime: '', Status: '' },
  monthlySummary: [],
  showModal: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateDailyStatus(state, { payload }: PayloadAction<DailyStatus>) {
      state.dailyStatus = payload;
    },
    updateMonthlySummary(state, { payload }: PayloadAction<DailySummary[]>) {
      state.monthlySummary = payload;
    },
    setShowModal(state, { payload }: PayloadAction<boolean>) {
      state.showModal = payload;
    },
  },
});

export const getStatus = (): AppThunk => async (dispatch, getState) => {
  const user = getState().auth.user;
  try {
    const d = new Date();
    const res = await api.get('/HrDailyAttendance', {
      params: {
        EmpCode: user?.EmpCode,
        AtnDate: `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`,
      },
    });
    if (res.status === 200) {
      dispatch(updateDailyStatus(res.data));
    } else {
      throw Error('Login failed');
    }
  } catch (e) {
    console.log(e.message);
    // dispatch(loginFailed('Login failed'));
  }
};

export const getSummary = (): AppThunk => async (dispatch, getState) => {
  const user = getState().auth.user;
  try {
    const res = await api.get('/HrAttendanceSummary', {
      params: {
        EmpCode: user?.EmpCode,
      },
    });
    if (res.status === 200) {
      dispatch(updateMonthlySummary(res.data));
    } else {
      throw Error(
        `Failed to fetch HrAttendanceSummary. Returned ${res.status}`,
      );
    }
  } catch (e) {
    console.log(e.message);
    // dispatch(loginFailed('Login failed'));
  }
};

export const submitAttendance = (reason: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    auth: { user },
    attendance: { dailyStatus },
  } = getState();

  dispatch(setShowModal(false));

  const isIn = dailyStatus.Status === 'Absent';

  Geolocation.getCurrentPosition(
    async (position) => {
      // console.log(position);
      const res = await api.get('/HrManualAttendance?', {
        params: {
          UserId: user?.UserId,
          EmpCode: user?.EmpCode,
          Type: isIn ? 'IN' : 'OUT',
          Comt: reason,
          Lati: position.coords.latitude,
          Longi: position.coords.longitude,
        },
      });

      // dispatch(getStatus());
      dispatch(
        updateDailyStatus({
          InTime: isIn ? new Date().toLocaleTimeString() : dailyStatus.InTime,
          Status: dailyStatus.Status === 'Absent' ? 'IN' : 'OUT',
          OutTime: !isIn
            ? new Date().toLocaleTimeString()
            : dailyStatus.OutTime,
        }),
      );
    },
    (error) => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  );
};

export const {
  updateDailyStatus,
  updateMonthlySummary,
  setShowModal,
} = authSlice.actions;

export default authSlice.reducer;
