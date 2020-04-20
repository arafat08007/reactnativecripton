import React from 'react';
import { View } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import GeneralStore from './GeneralStore';
import { appColors } from '~/theme';
import IctStore from './IctStore';
import IctService from './IctService';
import DncStore from './DncStore';

const Tabs = createBottomTabNavigator();

export default () => {
  return <Tabs.Navigator
  
  tabBarOptions={{
    
    activeTintColor: appColors.red,
    showIcon: true,
    inactiveTintColor:appColors.lightBlue
  }}
  >
    <Tabs.Screen
  
      options={{ title: "ICT Store", tabBarLabel:"ICT Store", 
      tabBarIcon: ({color}) => (
        <Icon
            name="mouse"
            color={color}
            size={16}
            raised={true}
            
        />
    )
    }}
      name="IctStore "
      component={IctStore }
    />
    
    <Tabs.Screen
      options={{ title: "ICT Service", tabBarLabel:"ICT service",
      tabBarIcon: ({color}) => (
        <Icon
            name="phonelink"
           
            color={color}
            size={16}
            raised={true}
        />
    )
    }}
      name="IctService "
      component={IctService }
    />


  <Tabs.Screen
      options={{ title: "General Store", tabBarLabel:"Gen. Store",
      tabBarIcon: ({color}) => (
        <Icon
            name="note"
            color={color}
            size={16}
            raised={true}
        />
    )
    }}
      name="GeneralStore"
      component={GeneralStore}
    />

<Tabs.Screen
      options={{ title: "Dnc Store", tabBarLabel:"DnC Store",
      tabBarIcon: ({color}) => (
        <Icon
            name="blur-on"
            color={color}
            size={16}
            raised={true}
           
        />
    )
    }}
      name="DncStore"
      component={DncStore}
    />


  </Tabs.Navigator>
}
