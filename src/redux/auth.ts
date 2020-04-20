import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk } from './store';
import { NavigationProp } from '~/screens/Login';
import api from '../api';

interface User {
  UserId: string;
  EmpId: string;
  EmpCode: string;
  LocId: string;
  Name: string;
  Department: string;
  Designation: string;
}

interface AuthState {
  user?: User;
  loading: boolean;
  message: string;
}

const initialState: AuthState = { loading: false, message: '' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested(state) {
      state.loading = true;
      state.message = '';
    },
    loginFailed(state, { payload }: PayloadAction<string>) {
      state.loading = false;
      state.message = payload;
    },
    loginSuccess(state, { payload }: PayloadAction<User>) {
      state.loading = false;
      state.message = '';
      state.user = payload;
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
    logout(state) {
      return initialState;
    },
  },
});

export const login = (
  UId: string,
  UPas: string,
  navigation: NavigationProp,
): AppThunk => async dispatch => {
  dispatch(loginRequested());
  try {
    const res = await api.get('/GetUserLogin', { params: { UId, UPas } });
    if (res.status === 200 && res.data.LogStatus === true) {
      dispatch(loginSuccess(res.data));
      navigation.replace('Dashboard');
    } else {
      throw Error('Login failed');
    }
  } catch (e) {
    console.log(e.message);
    dispatch(loginFailed('Login failed'));
  }
};

export const {
  setLoading,
  loginRequested,
  loginFailed,
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
