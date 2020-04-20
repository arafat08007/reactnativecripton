import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from './store';
import api from '~/api';

export interface ApprovalInfo {
  SL: string;
  Id: string;
  ReqId: string;
  ReqNum: string;
  RequesterName: string;
  RequesterDesi: string;
  ReqDate: string;
  DocName: string;
  DocType: string;
  ReqDepName: string;
  ReqLocName: string;
  BaseInfo: string;
  IsForward: boolean;
  IsActive: boolean;
}

export interface Requisition extends ApprovalInfo {
  itemDetails: string[];
  details?: string[];
  approverDetails: string[];
}

export interface Location {
  LocId: string;
  LocName: string;
}

interface ApprovalState {
  summary: ApprovalInfo[];
  requisitions: { [key: string]: Requisition };
  filters?: {
    location: string;
    status: string;
    sDate: string;
    eDate: string;
    reqNum: string;
  };
  locations: Location[];
  loading: boolean;
}

const initialState: ApprovalState = {
  summary: [],
  requisitions: {},
  locations: [],
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    gotSummary(state, { payload }: PayloadAction<ApprovalInfo[]>) {
      state.summary = payload;
      state.loading = false;
    },
    gotRequisition(state, { payload }: PayloadAction<Requisition>) {
      state.requisitions = {
        ...state.requisitions,
        [payload.BaseInfo]: payload,
      };
    },
    gotLocations(state, { payload }: PayloadAction<Location[]>) {
      state.locations = payload;
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
  },
});

export const getApprovalSummary = (filters?: {
  LocId?: string;
  sDate?: string;
  eDate?: string;
  status?: string;
  ReqNo?: string;
}): AppThunk => async (dispatch, getState) => {
  const user = getState().auth.user;
  dispatch(gotSummary([]));
  dispatch(setLoading(true));
  try {
    const { data } = await api.get('/SspReqApprovalSummary', {
      params: {
        EmpId: user?.EmpId, //'6914c387-70e4-4a1d-93ea-ea73ed365d2f', //
        SrcEmpId: user?.EmpId, // '6914c387-70e4-4a1d-93ea-ea73ed365d2f', //
        LocId: filters?.LocId || user?.LocId,
        Status: filters?.status || 'Pending',
        ReqNum: filters?.ReqNo || '',
        sDate: filters?.sDate || '',
        eDate: filters?.eDate || '',
      },
    });
    dispatch(gotSummary(data));
  } catch (e) {
    dispatch(setLoading(false));
    // throw e;
  }
};

export const getLocations = (): AppThunk => async (dispatch) => {
  try {
    const { data } = await api.get('/GetListLocation');
    dispatch(gotLocations(data));
  } catch (e) {
    throw e;
  }
};

export const getRequisition = (BaseInfo: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const user = getState().auth.user;
  try {
    const { data } = await api.get('/SspViewReq', {
      params: {
        EmpId: user?.EmpId,
        BaseInfo,
      },
    });
    data.BaseInfo = BaseInfo;
    data.approverDetails = data.ReqApproverDetl.split('_==_') as string[];
    data.ReqItemDetl &&
      (data.itemDetails = data.ReqItemDetl.split('_==_') as string[]);
    data.ReqDetails &&
      (data.details = data.ReqDetails.split('_==_') as string[]);
    dispatch(gotRequisition(data));
  } catch (e) {
    throw e;
  }
};

export const {
  gotSummary,
  gotRequisition,
  gotLocations,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;
