import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import { store, persistor } from './redux/store';
import theme from '~/theme';
import Bootstrap from './screens/Bootstrap';
import Approval from '~/screens/Approval';
import Requisition from '~/screens/Requisition';
import Attendance from '~/screens/Attendance';
import CompanyAttendance from '~/screens/CompanyAttendance';
import Profile from '~/screens/Profile';
import Leave from '~/screens/Leave';
import Requisitions from '~/screens/Requisitions';
import { ApprovalInfo } from '~/redux/approvals';

export type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  Dashboard: undefined;
  Bootstrap: undefined;
  Approval: undefined;
  Attendance: undefined;
  Leave: undefined;
  CompanyAttendance: { id: string, date?: Date };
  Requisition: { approvalInfo: ApprovalInfo };
  Requisitions: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <StatusBar
            backgroundColor={theme.colors?.primary}
            barStyle="light-content"
            translucent
          />
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Bootstrap" headerMode="screen">
              <Stack.Screen
                name="Bootstrap"
                component={Bootstrap}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Approval" component={Approval} />
              <Stack.Screen name="Requisition" component={Requisition} />
              <Stack.Screen name="Attendance" component={Attendance} />
              <Stack.Screen name="CompanyAttendance" component={CompanyAttendance} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Leave" component={Leave} />
              <Stack.Screen name="Requisitions" component={Requisitions} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};
