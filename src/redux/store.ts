import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import auth from './auth';
import attendance from './attendance';
import approvals from './approvals';
import attendanceInfo from './attendanceInfo';
import leave from './leave';

const rootReducer = combineReducers({
  auth,
  attendance,
  approvals,
  attendanceInfo,
  leave,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({ thunk: true, serializableCheck: false }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof persistedReducer>;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
